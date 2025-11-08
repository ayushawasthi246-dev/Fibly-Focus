import nodemailer from 'nodemailer'
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendMail(to, subject, html) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.SENDER_EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        })

        const mailOptions = {
            from: `"FiblyFocus" <${process.env.SENDER_EMAIL}>`,
            to,
            subject,
            html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log("✅ Mail sent:", result.response);
        return true;
    } catch (err) {
        console.error("❌ Email failed:", err.message);
        return false;
    }
}

export default sendMail;