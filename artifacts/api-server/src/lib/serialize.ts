import { inArray, sql, eq, and } from "drizzle-orm";
import {
  db,
  usersTable,
  questionsTable,
  answersTable,
  votesTable,
  tagsTable,
  questionTagsTable,
  categoriesTable,
  type User,
  type Question,
  type Answer,
} from "@workspace/db";

export interface ApiUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  reputation: number;
  role: string;
  plan: string;
  isSuspended: boolean;
  questionCount: number;
  answerCount: number;
  acceptedAnswerCount: number;
  createdAt: string;
}

export async function serializeUsers(users: User[]): Promise<Map<number, ApiUser>> {
  const map = new Map<number, ApiUser>();
  if (users.length === 0) return map;
  const ids = [...new Set(users.map((u) => u.id))];

  const qCounts = await db
    .select({ authorId: questionsTable.authorId, count: sql<number>`count(*)::int` })
    .from(questionsTable)
    .where(
      and(
        inArray(questionsTable.authorId, ids),
        eq(questionsTable.isDeleted, false),
        eq(questionsTable.status, "published"),
      ),
    )
    .groupBy(questionsTable.authorId);
  const aCounts = await db
    .select({
      authorId: answersTable.authorId,
      count: sql<number>`count(*)::int`,
      accepted: sql<number>`count(*) filter (where ${answersTable.isAccepted})::int`,
    })
    .from(answersTable)
    .where(and(inArray(answersTable.authorId, ids), eq(answersTable.isDeleted, false)))
    .groupBy(answersTable.authorId);

  const qMap = new Map(qCounts.map((r) => [r.authorId, r.count]));
  const aMap = new Map(aCounts.map((r) => [r.authorId, r]));

  for (const u of users) {
    map.set(u.id, {
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      avatarUrl: u.avatarUrl,
      bio: u.bio,
      reputation: u.reputation,
      role: u.role,
      plan: u.plan,
      isSuspended: u.isSuspended,
      questionCount: qMap.get(u.id) ?? 0,
      answerCount: aMap.get(u.id)?.count ?? 0,
      acceptedAnswerCount: aMap.get(u.id)?.accepted ?? 0,
      createdAt: u.createdAt.toISOString(),
    });
  }
  return map;
}

export async function serializeUser(user: User): Promise<ApiUser> {
  const map = await serializeUsers([user]);
  return map.get(user.id)!;
}

export async function serializeQuestions(
  questions: Question[],
  viewerId?: number,
): Promise<Record<string, unknown>[]> {
  if (questions.length === 0) return [];
  const ids = questions.map((q) => q.id);
  const authorIds = [...new Set(questions.map((q) => q.authorId))];

  const authors = await db
    .select()
    .from(usersTable)
    .where(inArray(usersTable.id, authorIds));
  const authorMap = await serializeUsers(authors);

  const tagRows = await db
    .select({
      questionId: questionTagsTable.questionId,
      name: tagsTable.name,
    })
    .from(questionTagsTable)
    .innerJoin(tagsTable, eq(questionTagsTable.tagId, tagsTable.id))
    .where(inArray(questionTagsTable.questionId, ids));
  const tagMap = new Map<number, string[]>();
  for (const r of tagRows) {
    tagMap.set(r.questionId, [...(tagMap.get(r.questionId) ?? []), r.name]);
  }

  const categoryIds = [
    ...new Set(questions.map((q) => q.categoryId).filter((id): id is number => id != null)),
  ];
  const categories = categoryIds.length
    ? await db.select().from(categoriesTable).where(inArray(categoriesTable.id, categoryIds))
    : [];
  const categoryMap = new Map(categories.map((c) => [c.id, { slug: c.slug, name: c.name }]));

  const answerCounts = await db
    .select({ questionId: answersTable.questionId, count: sql<number>`count(*)::int` })
    .from(answersTable)
    .where(and(inArray(answersTable.questionId, ids), eq(answersTable.isDeleted, false)))
    .groupBy(answersTable.questionId);
  const acMap = new Map(answerCounts.map((r) => [r.questionId, r.count]));

  let voteMap = new Map<number, number>();
  if (viewerId) {
    const votes = await db
      .select()
      .from(votesTable)
      .where(
        and(
          eq(votesTable.userId, viewerId),
          eq(votesTable.targetType, "question"),
          inArray(votesTable.targetId, ids),
        ),
      );
    voteMap = new Map(votes.map((v) => [v.targetId, v.value]));
  }

  return questions.map((q) => ({
    id: q.id,
    slug: q.slug,
    title: q.title,
    body: q.body,
    language: q.language,
    author: authorMap.get(q.authorId),
    tags: tagMap.get(q.id) ?? [],
    category: (q.categoryId != null ? categoryMap.get(q.categoryId) : null) ?? null,
    score: q.score,
    answerCount: acMap.get(q.id) ?? 0,
    viewCount: q.viewCount,
    hasAcceptedAnswer: q.acceptedAnswerId != null,
    isFeatured: q.isFeatured,
    status: q.status,
    myVote: voteMap.get(q.id) ?? null,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
  }));
}

export async function serializeAnswers(
  answers: Answer[],
  commentsByAnswer: Map<number, Record<string, unknown>[]>,
  viewerId?: number,
): Promise<Record<string, unknown>[]> {
  if (answers.length === 0) return [];
  const authorIds = [...new Set(answers.map((a) => a.authorId))];
  const authors = await db
    .select()
    .from(usersTable)
    .where(inArray(usersTable.id, authorIds));
  const authorMap = await serializeUsers(authors);

  let voteMap = new Map<number, number>();
  if (viewerId) {
    const votes = await db
      .select()
      .from(votesTable)
      .where(
        and(
          eq(votesTable.userId, viewerId),
          eq(votesTable.targetType, "answer"),
          inArray(votesTable.targetId, answers.map((a) => a.id)),
        ),
      );
    voteMap = new Map(votes.map((v) => [v.targetId, v.value]));
  }

  return answers.map((a) => ({
    id: a.id,
    questionId: a.questionId,
    body: a.body,
    language: a.language,
    author: authorMap.get(a.authorId),
    score: a.score,
    isAccepted: a.isAccepted,
    myVote: voteMap.get(a.id) ?? null,
    comments: commentsByAnswer.get(a.id) ?? [],
    createdAt: a.createdAt.toISOString(),
  }));
}
