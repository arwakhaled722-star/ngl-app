import nodemailer from "nodemailer";
    const transporter=nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
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