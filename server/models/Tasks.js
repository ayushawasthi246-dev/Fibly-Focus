import mongoose from "mongoose";

const taskschema = mongoose.Schema({
    Userid: { type: String, required: true },
    Projectid: { type: String, required: true },
    TaskHeading: { type: String, required: true },
    TaskDescription: { type: String, required: true, default: "" },
    Status: { type: String, required: true, default: "todo" },
    Priority: { type: String, required: true },
    Category: { type: String, required: true, default: "other" },
    index: { type: Number, required: true },
    Date: { type: Date, required: true }
}, { timestamps: true })

const TaskModel = mongoose.models.tasks || mongoose.model('tasks', taskschema)
export default TaskModel