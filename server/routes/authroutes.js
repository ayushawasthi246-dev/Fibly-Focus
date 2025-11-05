import express from "express";
import { isauthenticated, login, logout, register, resetpassword, resetpasswordotp, verification, resendotp, resetresendotp, setnewpassword, issinguptoken } from "../controllers/authcontroller.js";
import { reset, userauth, verify } from "../middlewear/userauth.js";

const authRouter = express.Router();

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.post('/logout', logout)
authRouter.post('/verification', verify, verification)
authRouter.post('/resend-otp', verify, resendotp)
authRouter.get('/is-auth', userauth, isauthenticated)
authRouter.get('/is-temptoken-singup', verify, issinguptoken)

authRouter.post('/send-passreset-otp', resetpasswordotp)
authRouter.post('/reset-verification', reset, resetpassword)
authRouter.post('/rest-resend-otp', reset, resetresendotp)
authRouter.post('/reset-password', reset, setnewpassword)

export default authRouter;
