import { logger } from "./logger";

/**
 * Pluggable email module (mail-server readiness scaffolding).
 *
 * Account emails (verification, forgot password) are handled by the auth
 * provider. This module exists for future product emails — digests,
 * announcements, moderation notices — and is transport-agnostic.
 *
 * To plug in a real mail server later, implement MailTransport (e.g. with
 * nodemailer + SMTP env vars) and pass it to setMailTransport at startup.
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
