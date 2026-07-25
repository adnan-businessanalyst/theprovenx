import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, translationsTable, questionsTable, answersTable } from "@workspace/db";
import { TranslateContentBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { requireAuth } from "../lib/currentUser";
import { translateLimiter } from "../lib/rateLimits";

const router: IRouter = Router();

const LANGUAGE_NAMES: Record<string, string> = { en: "English", ar: "Arabic" };

router.post("/translate", requireAuth, translateLimiter, async (req, res): Promise<void> => {
  const parsed = TranslateContentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.message });
    return;
  }
  const { contentType, contentId, target } = parsed.data;

  // Cached?
  const [cached] = await db
    .select()
    .from(translationsTable)
    .where(
      and(
        eq(translationsTable.contentType, contentType),
        eq(translationsTable.contentId, contentId),
        eq(translationsTable.target, target),
      ),
    );
  if (cached) {
    res.json({ title: cached.title, body: cached.body, target, cached: true });
    return;
  }

  let title: string | null = null;
  let body: string;
  if (contentType === "question") {
    const [q] = await db
      .select()
      .from(questionsTable)
      .where(and(eq(questionsTable.id, contentId), eq(questionsTable.isDeleted, false)));
    if (!q) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    title = q.title;
    body = q.body;
  } else {
    const [a] = await db
      .select()
      .from(answersTable)
      .where(and(eq(answersTable.id, contentId), eq(answersTable.isDeleted, false)));
    if (!a) {
      res.status(404).json({ message: "Content not found" });
      return;
    }
    body = a.body;
  }

  const langName = LANGUAGE_NAMES[target] ?? target;
  const response = await openai.chat.completions.create({
    model: "gpt-5.6-luna",
    max_completion_tokens: 8192,
    messages: [
      {
        role: "system",
        content: `You are a professional translator for a Q&A community about policies, regulations, and practical advice. Translate the provided content into ${langName}. Preserve meaning, tone, formatting, and any markdown. Respond ONLY with JSON: {"title": string | null, "body": string}. If no title is provided, return null for title.`,
      },
      {
        role: "user",
        content: JSON.stringify({ title, body }),
      },
    ],
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  let translatedTitle: string | null = null;
  let translatedBody = "";
  try {
    const json = JSON.parse(raw);
    translatedTitle = typeof json.title === "string" ? json.title : null;
    translatedBody = typeof json.body === "string" ? json.body : "";
  } catch {
    translatedBody = raw;
  }
  if (!translatedBody) {
    res.status(502).json({ message: "Translation failed, please try again" });
    return;
  }

  await db
    .insert(translationsTable)
    .values({ contentType, contentId, target, title: translatedTitle, body: translatedBody })
    .onConflictDoNothing();

  res.json({ title: translatedTitle, body: translatedBody, target, cached: false });
});

export default router;
