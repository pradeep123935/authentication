import { config } from "../config/app.config";
import { resend } from "./resendClient";

type Params = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
};

const mailer_sender =
  config.NODE_ENV === "development"
    ? `no-reply <onboarding@resend.dev>`
    : `no-reply <${config.MAILER_SENDER}>`;

export const sendEmail = async ({
  to,
  from = mailer_sender,
  subject,
  html,
  text,
}: Params) =>
  await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    text,
  });
