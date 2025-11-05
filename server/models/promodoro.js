import mongoose from "mongoose";

const Promodoroschema = mongoose.Schema({
    Userid: { type: String, required: true },
    Duration: {type:Number , required:true},
    Completed: {type:Boolean, default:false}
}, { timestamps: true })

const PromodoroModel = mongoose.models.Promodoro || mongoose.model('Promodoro', Promodoroschema)
export default PromodoroModel