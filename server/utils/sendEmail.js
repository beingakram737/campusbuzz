// File: server/utils/sendEmail.js (NEW FILE)

import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Transporter create karein (SMTP configuration)
    // Aapko .env file mein service, user aur password details set karni hongi
    const transporter = nodemailer.createTransport({
        // Gmail ya koi aur service use kar sakte hain
        service: process.env.EMAIL_SERVICE, 
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // 2. Email options set karein
    const mailOptions = {
        from: process.env.EMAIL_FROM, // Sender address (e.g., CampusBuzz <no-reply@campusbuzz.com>)
        to: options.to,               // User ka email
        subject: options.subject,     // Email ka subject
        html: options.text,           // HTML body for email content
    };

    // 3. Email bhejein
    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId); 
};

export default sendEmail;