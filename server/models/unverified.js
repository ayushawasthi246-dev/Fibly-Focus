import mongoose from "mongoose";

const userschema = mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    VerifyCode: { type: String, default: '' },
    VerifyCodeExpireAt: { type: Number, default: 0 },
    ResetPassCode: { type: String, default: '' },
    ResetPassCodeExpireAt: { type: Number, default: 0 },
    verifiedAccount: { type: Boolean, default: false },
})

const UnverifiedUserModel = mongoose.models.UnverifiedUser || mongoose.model('UnverifiedUser', userschema)
export default UnverifiedUserModel 