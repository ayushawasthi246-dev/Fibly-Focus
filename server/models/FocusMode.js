import mongoose from "mongoose";

const focusModeSchema = mongoose.Schema({
    Userid: { type: String, required: true },
    SessionTitle: { type: String, required: true },
    SessionCategory: { type: String, required: true, default: "other" },
    SessionDuration: { type: Number, required: true },
    BreakDuration: { type: Number, required: true },
    NumberOfCycle: { type: Number, required: true },
    Completed: { type: Boolean, default: false },
    Duration: { type: Number, required: true },
}, { timestamps: true })

const FocusModeModel = mongoose.models.focusSession || mongoose.model('focusSession', focusModeSchema)
export default FocusModeModel