import nodemailer from 'nodemailer'
import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function createTransporter() {
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
                accessToken: accessToken
            }
        })

        return transporter
    } catch (error) {
        throw new Error('Error creating mail transporter');
    }
}

export default createTransporter;