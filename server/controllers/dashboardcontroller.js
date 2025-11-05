import ProjectModel from "../models/project.js"
import VerifiedUserModel from "../models/verified.js"

export const projectdata = async (req, res) => {
    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }
    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const projects = await ProjectModel.find({ Userid: UserID })

        

        projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        const pinned = projects.filter(p => p.isPinned)
        const unpinned = projects.filter(p => !p.isPinned)

        const orderedProjects = [...pinned , ...unpinned]

        const activeprojects = orderedProjects.slice(0,3)
        
        const projectslist = activeprojects.map(project => ({
            Heading: project.Heading,
            numOfTask: project.TodoTasks + project.InprogressTasks + project.CompletedTasks,
            complianceRate: project.TodoTasks + project.InprogressTasks + project.CompletedTasks > 0
                ? Math.round(
                    (project.CompletedTasks / (project.TodoTasks + project.InprogressTasks + project.CompletedTasks)) * 100
                )
                : 0,
            ProjectID: project._id,
            isPin: project.isPinned
        }))

        res.json({
            success: true,
            ProjectData: projectslist
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const stats = async (req, res) => {
    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }
    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        const projects = await ProjectModel.find({ Userid: UserID })

        let totaltasks = 0
        let todotasks = 0
        let inprogrestasks = 0
        let completedtasks = 0

        projects.forEach((p) => {
            totaltasks += (p.TodoTasks + p.InprogressTasks + p.CompletedTasks)
            todotasks += p.TodoTasks
            inprogrestasks += p.InprogressTasks
            completedtasks += p.CompletedTasks
        })

        res.json({ success: true, totaltasks, completedtasksRate: Math.round((completedtasks / totaltasks) * 100), inprogrestasks, todotasks, completedtasks })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const pinproject = async(req,res)=>{
    const {projectID} = req.body

    if(!projectID){
        return res.json({ success: false, message: "Project id not found" })
    }

    try {
        const project = await ProjectModel.findById(projectID)

        if(!project){            
            return res.json({ success: false, message: "Project not found" })
        }

        project.isPinned = !project.isPinned
        await project.save()

        return res.json({ success: true, message: "PINNED" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}