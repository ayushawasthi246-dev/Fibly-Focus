import mongoose from "mongoose";

const userschema = mongoose.Schema({
    Username: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    ResetPassCode: { type: String, default: '' },
    ResetPassCodeExpireAt: { type: Number, default: 0 },
    LongestStreak: { type: Number, default: 0 },
    CurrentStreak: { type: Number, default: 0 },
    LastActive: { type: Date, default: null },
    HasSeenWelcome: { type: Boolean, default: false }
})

const VerifiedUserModel = mongoose.models.VerifiedUser || mongoose.model('VerifiedUser', userschema)
export default VerifiedUserModel