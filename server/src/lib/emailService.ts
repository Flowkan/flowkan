import { Resend } from "resend";
import dotenv from "dotenv";

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
    console.log("Email enviado:", data);
    return data;
  } catch (err) {
    console.error("Error enviando email:", err);
    throw err;
  }
}
