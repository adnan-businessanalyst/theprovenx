import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, sponsorInquiriesTable, usersTable } from "@workspace/db";
import { CreateSponsorInquiryBody } from "@workspace/api-zod";
import { sponsorInquiryLimiter } from "../lib/rateLimits";
import { notifyUser } from "../lib/notify";

const router: IRouter = Router();

router.post("/sponsor-inquiries", sponsorInquiryLimiter, async (req, res): Promise<void> => {
  const parsed = CreateSponsorInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Please fill in all required fields correctly." });
    return;
  }
  const { company, contactName, email, budgetRange, message, website } = parsed.data;

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (website && website.trim().length > 0) {
    res.status(201).json({ message: "Thank you! We'll be in touch soon." });
    return;
  }

  await db.insert(sponsorInquiriesTable).values({
    company: company.trim(),
    contactName: contactName.trim(),
    email: email.trim(),
    budgetRange,
    message: message.trim(),
  });

  // Alert all admins in-app so hot leads don't go cold.
  const admins = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.role, "admin"));
  await Promise.all(
    admins.map((admin) =>
      notifyUser({
        userId: admin.id,
        type: "admin",
        message: `New sponsor inquiry from ${company.trim()} (${contactName.trim()}, ${budgetRange})`,
        link: "/admin?tab=sponsors",
      }),
    ),
  );

  res.status(201).json({ message: "Thank you! We'll be in touch soon." });
});

export default router;
