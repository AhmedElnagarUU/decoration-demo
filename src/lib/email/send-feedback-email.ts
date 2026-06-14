import nodemailer from "nodemailer";

const FEEDBACK_RECIPIENT =
  process.env.FEEDBACK_RECIPIENT_EMAIL ?? "ahmedelnageuu@gmail.com";

interface FeedbackEmailInput {
  message: string;
  page?: string;
  userEmail: string;
  userName: string;
}

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass },
  });
}

export async function sendFeedbackEmail(input: FeedbackEmailInput) {
  const transport = createTransport();
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "noreply@localhost";

  const subject = `Dashboard feedback from ${input.userName}`;
  const text = [
    `From: ${input.userName} <${input.userEmail}>`,
    input.page ? `Page: ${input.page}` : null,
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  if (!transport) {
    console.log("Feedback email (SMTP not configured):", {
      to: FEEDBACK_RECIPIENT,
      subject,
      text,
    });
    return;
  }

  await transport.sendMail({
    from,
    to: FEEDBACK_RECIPIENT,
    replyTo: input.userEmail,
    subject,
    text,
  });
}
