import nodemailer from "nodemailer";
import { envVars } from "../config/env";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/AppError";


const transporter = nodemailer.createTransport({
      port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
      host: envVars.EMAIL_SENDER.SMTP_HOST,
      auth: {
            user: envVars.EMAIL_SENDER.SMTP_USER,
            pass: envVars.EMAIL_SENDER.SMTP_PASS
      },
      secure: true
});

interface ISendEmailOptions {
      to: string;
      subject: string;
      templateName: string;
      templateData: Record<string, any>;
      attachments?: {
            filename: string;
            content: Buffer | string;
            contentType: string;
      }[]
}

export const sendEmail = async ({ to, subject, templateName, templateData, attachments }: ISendEmailOptions) => {
      try {
            const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
            const html = await ejs.renderFile(templatePath, templateData)
            const info = await transporter.sendMail({
                  from: envVars.EMAIL_SENDER.SMTP_FROM,
                  to: to,
                  subject: subject,
                  html: html,
                  attachments: attachments?.map(attachment => ({
                        filename: attachment.filename,
                        content: attachment.content,
                        contentType: attachment.contentType
                  }))
            });
            console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
      } catch (error) {
            console.log("email sending error:", error);
            throw new AppError(401, "Email Sending Error")
      }
};