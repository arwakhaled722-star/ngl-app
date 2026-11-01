import nodemailer from "nodemailer";
import { env } from '../config/env.js';
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
            user:env.nodemailer.user,
            pass:env.nodemailer.password
        }
    });
    export async function sendEmail(to, subject, html){
    await transporter.sendMail({
        from:`"NGL_APP"<${process.env.MAIL_USER}>`,
        to:to,
        subject:subject,
        html:html
    })
}