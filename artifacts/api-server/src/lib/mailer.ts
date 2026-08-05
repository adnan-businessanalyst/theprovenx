import nodemailer from "nodemailer";
import { logger } from "./logger";

/**
 * Pluggable email module (mail-server readiness scaffolding).
 *
 * Uses SMTP (Mailgun, etc.) when SMTP_* env vars are set; otherwise logs in dev.
 * Used for password-reset emails and future product emails (digests,
 * announcements, moderation notices). Transport-agnostic.
 */
export interface MailMessage {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface MailTransport {
  send(message: MailMessage): Promise<void>;
}

/** Default dev transport: logs the message instead of sending. */
const logTransport: MailTransport = {
  async send(message) {
    logger.info(
      { to: message.to, subject: message.subject },
      "Email (dev preview transport — no mail server configured)",
    );
  },
};

let transport: MailTransport = logTransport;

export function setMailTransport(t: MailTransport): void {
  transport = t;
}

export async function sendMail(message: MailMessage): Promise<void> {
  await transport.send(message);
}

function createSmtpTransport(): MailTransport | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) {
    return null;
  }
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === "true";
  const from = process.env.MAIL_FROM?.trim() || user;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  return {
    async send(message: MailMessage) {
      try {
        await transporter.sendMail({
          from,
          to: message.to,
          subject: message.subject,
          text: message.text,
          html: message.html,
        });
        logger.info({ to: message.to, subject: message.subject }, "Email sent");
      } catch (err) {
        logger.error({ err, to: message.to, subject: message.subject }, "Email send failed");
        throw err;
      }
    },
  };
}
/** Call once at API startup. */
export function initMailer(): void {
  const smtp = createSmtpTransport();
  if (!smtp) {
    logger.info("Mailer: SMTP not configured — using log transport");
    setMailTransport(logTransport);
    return;
  }
  setMailTransport(smtp);
  logger.info(
    {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || "587",
      secure: process.env.SMTP_SECURE === "true",
    },
    "Mailer: SMTP transport enabled",
  );
}