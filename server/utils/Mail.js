import transporter from '../config/nodEmailer.js'

export const SendOTP = async (user, purpose) => {

    try {

        if (user.verifiedAccounta) {
            return ({ success: false, message: "User already exists" })
        }

        const otp = String(Math.floor(Math.random() * 900000 + 100000))

        if (purpose == "verify") {
            user.VerifyCode = otp
            user.VerifyCodeExpireAt = Date.now() + 24 * 60 * 60 * 1000
        } else {
            user.ResetPassCode = otp
            user.ResetPassCodeExpireAt = Date.now() + 24 * 60 * 60 * 1000
        }

        await user.save()

        const VerifyOTPMail = {
            from: process.env.SMTP_User,
            to: user.Email,
            subject: purpose == "verify" ? "Account Verification OTP" : "Password Rest OTP",
            text: `Your OTP is ${otp} for ${purpose == "verify" ? "account verification" : "reseting your password"}`
        }

        await transporter.sendMail(VerifyOTPMail);

        return ({ success: true, message: "OTP has been sent to your email" })
    } catch (error) {
        return ({ success: false, message:error.message });
    }
}

export const WelcomeMail = async (user) => {

    try {
        if (!user) {
            return ({ success: false, message: "Missing detail" })
        }

        const WelcomeMail = {
            from: process.env.SMTP_User,
            to: user.Email,
            subject: "Welcome to FiblyFocus",
            text: `Thanks for joing the FiblyFocus . Hey ${user.Username} your account has been created by : ${user.Email} `,
        }

        await transporter.sendMail(WelcomeMail);

    } catch (error) {
        return ({ success: false, message: error.message });
    }
}
