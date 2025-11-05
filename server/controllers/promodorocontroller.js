import ProjectModel from "../models/project.js"
import PromodoroModel from "../models/promodoro.js"
import TaskModel from "../models/Tasks.js"
import VerifiedUserModel from "../models/verified.js"

export const todaytask = async (req, res) => {

    const UserID = req.user.id
    const { today } = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            res.json({ success: false, message: "user does not exists" })
        }
        const start = new Date(`${today}T00:00:00.000Z`);
        const end = new Date(`${today}T23:59:59.999Z`);

        const todayTasks = await TaskModel.find({
            Userid: UserID,
            Date: { $gte: start, $lte: end }
        });

        const TasksData = await Promise.all(
            todayTasks.map(async (task) => {
                const project = await ProjectModel.findById(task.Projectid);
                return {
                    Projectname: project ? project.Heading : null,
                    Heading: task.TaskHeading,
                };
            })
        );

        res.json({ success: true, TasksData })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const createSession = async (req, res) => {
    const UserID = req.user.id
    const { duration } = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "user does not exists" })
        }

        if(duration !== "5" && duration !== "25" && duration !== "45"){
            return res.json({ success: false, message: "This timer data will not be saved in data base" })
        }

        const session = new PromodoroModel({ Duration: duration , Userid:UserID})
        await session.save()

        const ID = session._id
        return res.json({ success: true, ID })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const updateSession = async (req, res) => {

    const { sessionID } = req.body

    if(!sessionID){
        return res.json({ success: false, message: "session not found" })
    }

    try {
        const existingSession = await PromodoroModel.findById({ _id: sessionID })
        if (existingSession) {
            existingSession.Completed = true
            await existingSession.save()
            return res.json({ success: true, message: "done" })
        } else {
            return res.json({ success: false, message: "Can't find your session" })
        }

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}
