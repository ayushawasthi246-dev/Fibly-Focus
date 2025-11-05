import mongoose from "mongoose";

const projectschema = mongoose.Schema({
    Userid: { type: String, required: true },
    Heading: { type: String, required: true },
    Color: { type: String, default: "#B13BC3"},
    isPinned: { type: Boolean, default: false},
    TodoTasks: { type: Number, default: 0 },
    InprogressTasks: { type: Number, default: 0 },
    CompletedTasks: { type: Number, default: 0 },
}, { timestamps: true })

projectschema.index({ Userid: 1, Heading: 1 }, { unique: true });

const ProjectModel = mongoose.models.project || mongoose.model('project', projectschema)
export default ProjectModel