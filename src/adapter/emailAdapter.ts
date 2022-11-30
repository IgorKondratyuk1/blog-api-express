import nodemailer from "nodemailer";
import {SETTINGS} from "../config";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: SETTINGS.GMAIL_LOGIN,
                pass: SETTINGS.GMAIL_PASS
            },
        });

        let info = await transporter.sendMail({
            from: `"Igor 👻" <${SETTINGS.GMAIL_LOGIN}>`, // sender address
            to: email, // list of receivers
            subject: `${subject} ✔`, // Subject line
            html: message, // html body
        });

        return info;
    }
}