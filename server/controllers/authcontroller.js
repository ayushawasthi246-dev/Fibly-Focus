import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UnverifiedUserModel from "../models/unverified.js"
import VerifiedUserModel from '../models/verified.js'
import { SendOTP, WelcomeMail } from '../utils/Mail.js'

export const register = async (req, res) => {

    const { Username, Email, Password } = req.body;

    if (!Username || !Email || !Password) {
        return res.json({ success: false, message: 'Missing Details' })
    }

    try {
        const existingUser = await UnverifiedUserModel.findOne({ Email })
        const verifieduser = await VerifiedUserModel.findOne({ Email })

        if (verifieduser) {
            return res.json({ success: false, message: 'User already exists' })
        }

        if (existingUser) {

            if (existingUser.verifiedAccount) {
                return res.json({ success: false, message: 'User already exists' })
            } else {

                const HashPassword = await bcrypt.hash(Password, 10)
                existingUser.Username = Username
                existingUser.Password = HashPassword

                await existingUser.save()

                if (existingUser.VerifyCodeExpireAt > Date.now()) {

                    const temptoken_signup = jwt.sign({ id: existingUser._id }, process.env.JWT_SecrectKey, { expiresIn: '1d' })

                    res.cookie('temptoken_signup', temptoken_signup, {
                        httpOnly: true,
                        secure: process.env.Node_ENV === 'production',
                        sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
                        maxAge: 60 * 60 * 1000
                    })

                    return res.json({ success: true, message: "Same OTP is valid for 1 hour" })

                }

                SendOTP(existingUser, "verify")
            }
        } else {
            const HashPassword = await bcrypt.hash(Password, 10)

            const user = new UnverifiedUserModel({ Username, Email, Password: HashPassword })
            await user.save()

            const temptoken_signup = jwt.sign({ id: user._id }, process.env.JWT_SecrectKey, { expiresIn: '1d' })

            res.cookie('temptoken_signup', temptoken_signup, {
                httpOnly: true,
                secure: process.env.Node_ENV === 'production',
                sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
                maxAge: 60 * 60 * 1000
            })

            SendOTP(user, "verify")
        }

        return res.json({ success: true, message: "Verification OTP has been sent to your email" });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const login = async (req, res) => {

    const { Email, Password } = req.body

    if (!Email || !Password) {
        return res.json({ success: false, message: "Email and Password Required" })
    }

    try {

        const user = await VerifiedUserModel.findOne({ Email })

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        const isMatch = await bcrypt.compare(Password, user.Password)

        if (!isMatch) {
            return res.json({ success: false, message: "Password is incorrect" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SecrectKey, { expiresIn: '7d' })

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "logged In" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            path: "/"
        })

        return res.json({ success: true, message: "logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const resendotp = async (req, res) => {

    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "please singup again" })
    }

    try {
        const user = await UnverifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "please singup again" })
        }

        SendOTP(user, "verify")

        return res.json({ success: true, message: "Verification OTP has been sent to your email" });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const verification = async (req, res) => {

    const UserID = req.user.id
    const { otp } = req.body

    if (!UserID || !otp) {
        return res.json({ success: false, message: "OTP is requried" })
    }

    try {
        const user = await UnverifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "please singup again" })
        }

        if (user.VerifyCode === "" || user.VerifyCode !== otp) {
            return res.json({ success: false, message: "Invalid Code" })
        }

        if (user.VerifyCodeExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP has been Expired" })
        }

        const account = new VerifiedUserModel({
            Username: user.Username,
            Email: user.Email,
            Password: user.Password
        })
        await account.save()

        await UnverifiedUserModel.findByIdAndDelete(UserID)

        const token = jwt.sign({ id: account._id }, process.env.JWT_SecrectKey, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.clearCookie("temptoken_signup", {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            path: "/"
        })

        WelcomeMail(account)

        return res.json({ success: true, message: "Your email has been successfully verified and your account is now created." })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const isauthenticated = async (req, res) => {

    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "Can't find user" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        return res.json({ success: true, message: "User is already logged in" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const issinguptoken = async (req, res) => {
    try {
        return res.json({ success: true, message: "User is already logged in" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const resetpasswordotp = async (req, res) => {

    const { Email } = req.body

    if (!Email) {
        return res.json({ success: false, message: "Email is requried" })
    }

    try {

        const user = await VerifiedUserModel.findOne({ Email })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.ResetPassCodeExpireAt > Date.now()) {

            const temptoken_reset = jwt.sign({ id: user._id }, process.env.JWT_SecrectKey, { expiresIn: '1d' })

            res.cookie('temptoken_reset', temptoken_reset, {
                httpOnly: true,
                secure: process.env.Node_ENV === 'production',
                sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
                maxAge: 60 * 60 * 1000
            })

            return res.json({ success: true, message: "Same OTP is valid for 1 hour" })
        }

        SendOTP(user, "reset")

        const temptoken_reset = jwt.sign({ id: user._id }, process.env.JWT_SecrectKey, { expiresIn: '1d' })

        res.cookie('temptoken_reset', temptoken_reset, {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge: 60 * 60 * 1000
        })

        return res.json({ success: true, message: "Password Rsetting OTP has been sent to your email" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const resetresendotp = async (req, res) => {

    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "Missing information" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        SendOTP(user, "reset")

        return res.json({ success: true, message: "Password Rsetting OTP has been sent to your email" });

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const resetpassword = async (req, res) => {

    const UserID = req.user.id
    const { otp } = req.body

    if (!UserID || !otp) {
        return res.json({ success: false, message: "Missing infromation" })
    }

    try {

        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.ResetPassCode === "" || user.ResetPassCode !== otp) {
            return res.json({ success: false, message: "Invalid code" })
        }

        if (user.ResetPassCodeExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP has been Expired" })
        }

        user.ResetPassCode = ""
        user.ResetPassCodeExpireAt = 0

        await user.save()

        return res.json({ success: true, message: "Now you can set your New Password" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const setnewpassword = async (req, res) => {

    const UserID = req.user.id
    const { NewPassword } = req.body

    if (!UserID || !NewPassword) {
        return res.json({ success: false, message: "Password is missing" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.ResetPassCode !== "" && user.ResetPassCodeExpireAt !== 0) {
            return res.json({ success: false, message: "somthing went wrong try again" })
        }
        const HashPassword = await bcrypt.hash(NewPassword, 10)
        user.Password = HashPassword
        await user.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SecrectKey, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.clearCookie("temptoken_reset", {
            httpOnly: true,
            secure: process.env.Node_ENV === 'production',
            sameSite: process.env.Node_ENV === 'production' ? 'none' : 'strict',
            path: "/"
        })

        return res.json({ success: true, message: "New password is set" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}