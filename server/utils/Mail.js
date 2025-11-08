import sendMail from "../config/nodemailer.js"

export const SendOTP = async (user, purpose) => {

    try {

        if (user.verifiedAccounta) {
            return ({ success: false, message: "User already exists" })
        }

        const otp = String(Math.floor(Math.random() * 900000 + 100000))

        if (purpose == "verify") {
            user.VerifyCode = otp
            user.VerifyCodeExpireAt = Date.now() + 60 * 60 * 1000
        } else {
            user.ResetPassCode = otp
            user.ResetPassCodeExpireAt = Date.now() + 60 * 60 * 1000
        }

        await user.save()

        // const VerifyOTPMail = {
        //     from: `"FiblyFocus" <${process.env.SENDER_EMAIL}>`,
        //     to: user.Email,
        //     subject: purpose == "verify" ? "Account Verification OTP" : "Password Rest OTP",
        //     html: `
        //     <!DOCTYPE html>
        //     <html>
        //     <head>
        //             <meta charset="UTF-8">
        //             <title>OTP Email</title>
        //         </head>
        //         <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin:0; padding:0;">
        //             <table width="100%" cellpadding="0" cellspacing="0">
        //             <tr>
        //                 <td align="center">
        //                 <table width="400" cellpadding="0" cellspacing="0" style="background-color:#fff; padding:20px;">
        //                     <tr>
        //                     <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
        //                         ${purpose == "verify" ? "Verify Your Account" : "Reset Your Password"}
        //                     </td>
        //                     </tr>
        //                     <tr>
        //                     <td style="padding:20px 0; font-size:18px; color:#555; text-align:center;">
        //                     Your OTP is 
        //                     <div style="font-size:30px; font-weight:bold; color:#1a73e8; margin:15px 0; letter-spacing: 4px;"> ${otp}</div>
        //                     Please use this OTP to ${purpose == "verify" ? "verify your FiblyFocus account and complete your registration." : "reset your FiblyFocus account password."}.
        //                     </td>
        //                     </tr>
        //                     <tr>
        //                     <td style="font-size:15px; color:#999; text-align:center;">
        //                         If you did not request this OTP, please ignore this email or contact us if you have any concerns.
        //                         </td>
        //                         </tr>
        //                         </table>
        //                         </td>
        //                         </tr>
        //                         </table>
        //                         </body>
        //                         </html>
        //                         `
        // }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                    <meta charset="UTF-8">
                    <title>OTP Email</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f6f6f6; margin:0; padding:0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td align="center">
                        <table width="400" cellpadding="0" cellspacing="0" style="background-color:#fff; padding:20px;">
                            <tr>
                            <td align="center" style="font-size:24px; font-weight:bold; color:#333;">
                                ${purpose == "verify" ? "Verify Your Account" : "Reset Your Password"
            }
                            </td >
                            </tr >
                            <tr>
                            <td style="padding:20px 0; font-size:18px; color:#555; text-align:center;">
                            Your OTP is 
                            <div style="font-size:30px; font-weight:bold; color:#1a73e8; margin:15px 0; letter-spacing: 4px;"> ${otp}</div>
                            Please use this OTP to ${purpose == "verify" ? "verify your FiblyFocus account and complete your registration." : "reset your FiblyFocus account password."}.
                            </td>
                            </tr>
                            <tr>
                            <td style="font-size:15px; color:#999; text-align:center;">
                                If you did not request this OTP, please ignore this email or contact us if you have any concerns.
                                </td>
                                </tr>
                                </table >
                                </td >
                                </tr >
                                </table >
                                </body >
                                </html >
    `
        const subject = purpose === "verify"
            ? "Account Verification OTP"
            : "Password Reset OTP";

        const success = await sendMail(user.Email, subject, html);
        if (success) res.json({ success: true });
        else res.status(500).json({ success: false });

        return ({ success: true, message: "OTP has been sent to your email" })
    } catch (error) {
        return ({ success: false, message: error.message });
    }
}

export const WelcomeMail = async (user) => {

    try {
        if (!user) {
            return ({ success: false, message: "Missing detail" })
        }

        //         const WelcomeMail = {
        //             from: process.env.SMTP_User,
        //             to: user.Email,
        //             subject: "Welcome to FiblyFocus",
        //             html: `
        //     < !DOCTYPE html >
        //         <html>
        //             <head>
        //                 <meta charset="UTF-8" />
        //                 <title>Welcome Email</title>
        //             </head>
        //             <body style="margin: 0; padding: 0; background-color: #f3f3f3; font-family: Arial, sans-serif;">
        //                 <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; overflow: hidden;">
        //                     <div style="padding: 5px 30px; text-align: center;">
        //                         <h1 style="font-size: 30px; color: #111111; margin-bottom: 20px;">Welcome to FiblyFocus!</h1>
        //                         <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
        //                             Hey there! 🎉 Your email has been successfully verified.
        //                         </p>
        //                         <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 35px;">
        //                             FiblyFocus helps you stay productive, track your Pomodoro sessions, and manage your tasks efficiently. You’re all set to begin your focus journey.
        //                         </p>
        //                     </div>

        //                     <div style="background-color: #111111; color: #ffffff; text-align: center; padding: 25px;">
        //                         <p style="font-size: 14px; margin-bottom: 25px;">
        //                             We'd love to hear from you! If you ever face any issues or want to share your experience, you can raise it here:
        //                         </p>

        //                         <a href="mailto:${process.env.SMTP_User}" target="_blank"
        //                             style="font-size: 14px; background-color: #ffffff; color: #111111; text-decoration: none; padding: 14px 28px; border-radius: 25px; font-weight: bold; display: inline-block;">
        //                             Share Feedback
        //                         </a>

        //                         <p style="font-size: 14px; color: #ffffff91; margin-top: 25px;">
        //                             If you did not request this verification, please ignore this email or let us know.
        //                         </p>
        //                     </div>
        //                 </div>
        //             </body>
        //         </html>
        // `
        //             ,
        //         }

        const html = `
        < !DOCTYPE html >
        <html>
            <head>
                <meta charset="UTF-8" />
                <title>Welcome Email</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f3f3f3; font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; overflow: hidden;">
                    <div style="padding: 5px 30px; text-align: center;">
                        <h1 style="font-size: 30px; color: #111111; margin-bottom: 20px;">Welcome to FiblyFocus!</h1>
                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                            Hey there! 🎉 Your email has been successfully verified.
                        </p>
                        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-bottom: 35px;">
                            FiblyFocus helps you stay productive, track your Pomodoro sessions, and manage your tasks efficiently. You’re all set to begin your focus journey.
                        </p>
                    </div>

                    <div style="background-color: #111111; color: #ffffff; text-align: center; padding: 25px;">
                        <p style="font-size: 14px; margin-bottom: 25px;">
                            We'd love to hear from you! If you ever face any issues or want to share your experience, you can raise it here:
                        </p>

                        <a href="mailto:${process.env.SMTP_User}" target="_blank"
                            style="font-size: 14px; background-color: #ffffff; color: #111111; text-decoration: none; padding: 14px 28px; border-radius: 25px; font-weight: bold; display: inline-block;">
                            Share Feedback
                        </a>

                        <p style="font-size: 14px; color: #ffffff91; margin-top: 25px;">
                            If you did not request this verification, please ignore this email or let us know.
                        </p>
                    </div>
                </div>
            </body>
        </html>
`

        const success = await sendMail(user.Email, "Welcome to FiblyFocus", html);
        if (success) res.json({ success: true });
        else res.status(500).json({ success: false });

    } catch (error) {
        return ({ success: false, message: error.message });
    }
}
