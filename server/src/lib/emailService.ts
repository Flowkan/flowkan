import { Resend } from "resend";
import dotenv from "dotenv";
import path from "node:path";
import ejs from "ejs";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const data = await resend.emails.send({
      from: `Flowkan <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    return data;
  } catch (err) {
    console.error("Error enviando email:", err);
    throw err;
  }
}

interface dataEmail {
  url_frontend: string;
  token: string;
}
export async function templateChangePasswordEmail(data: dataEmail) {
  const templatePath = path.join(
    __dirname,
    "..",
    "views",
    "email.change.password.ejs",
  );
  return await ejs.renderFile(templatePath, data);
}

interface headerEmail {
  to: string;
  subject: string;
  // html: string;
}
export async function sendChangePasswordEmail(
  header: headerEmail,
  data: dataEmail,
) {
  const { to, subject } = header;
  const html = await templateChangePasswordEmail(data);

  await sendEmail(to, subject, html);
}
