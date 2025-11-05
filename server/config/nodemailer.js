import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_User,
        pass: process.env.SMTP_Pass,
    },
})

export default f;