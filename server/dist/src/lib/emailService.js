"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
async function sendEmail(to, subject, html) {
    try {
        const data = await resend.emails.send({
            from: `Flowkan <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
        console.log("Email enviado:", data);
        return data;
    }
    catch (err) {
        console.error("Error enviando email:", err);
        throw err;
    }
}
