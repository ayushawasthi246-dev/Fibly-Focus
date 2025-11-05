import ProjectModel from "../models/project.js"
import TaskModel from "../models/Tasks.js"
import VerifiedUserModel from "../models/verified.js"

export const taskslistofmonth = async (req, res) => {

    const UserID = req.user.id
    const { month, year } = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        const start = new Date(year, month, 1, 0, 0, 0, 0,)
        const end = new Date(year, month + 1, 0, 23, 59, 59, 999)

        const tasks = await TaskModel.find({
            Userid: UserID,
            Date: { $gte: start, $lte: end }
        }).sort({ Date: 1, index: 1 })

        const grouped = {}
        const projectMap = {}

        const projects = await ProjectModel.find({ Userid: UserID })
        projects.forEach((p) => {
            projectMap[(p._id).toString()] = p.Heading
        })

        tasks.forEach((task) => {
            const day = task.Date.toISOString().split("T")[0]
            if (!grouped[day]) grouped[day] = []

            grouped[day].push({
                Taskid: task._id,
                Heading: task.TaskHeading,
                Description: task.TaskDescription,
                Category: task.Category,
                Date: task.Date,
                Status: task.Status,
                Priority: task.Priority,
                Project: projectMap[task.Projectid],
                projectID: task.Projectid
            })
        })

        res.json({ success: true, grouped })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const checkmarked = async (req, res) => {
    const { taskid, projectid, taskstatus } = req.body

    try {
        const Task = await TaskModel.findById(taskid)

        if (!Task) {
            return res.json({ success: false, message: "Can't find your task" })
        }
        
        if (Task.Status === "completed") {
            return res.json({ success: false, message: "Task is already completed" })
        }

        Task.Status = "completed"
        await Task.save()

        const fieldMap = {
            todo: "TodoTasks",
            inprogress: "InprogressTasks",
            completed: "CompletedTasks"
        };

        await ProjectModel.findByIdAndUpdate(
            projectid,
            {
                $inc: {
                    [fieldMap[taskstatus]]: -1,
                    [fieldMap["completed"]]: 1
                }
            },
            { new: true }
        );

        res.json({ success: true, message: "marked as completed" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const projectlist = async (req, res) => {

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

        res.json({
            success: true,
            ProjectData: projects.map(project => ({
                Heading: project.Heading,
                ProjectID: project._id
            }))
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const createtask = async (req, res) => {

    const UserID = req.user.id
    const { TaskHeading, TaskDescription, Priority, Category, Projectname, Date } = req.body

    if (!TaskHeading || !Priority || !Category || !TaskDescription || !Projectname) {
        res.json({ success: false, message: "Please Enter all the details" })
    }

    let id
    let idx
    const existingProject = await ProjectModel.findOne({ Heading: Projectname })

    if (existingProject) {
        id = existingProject._id
        idx = existingProject.TodoTasks + 1
    } else {
        const project = new ProjectModel({ Heading: Projectname, Userid: UserID })
        await project.save()
        id = project._id
        idx = 1
    }

    if (!UserID || !id) {
        res.json({ success: false, message: "Something went missing . try again" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            res.json({ success: false, message: "user does not exists" })
        }

        const Task = new TaskModel({ Userid: UserID, Projectid: id, TaskHeading, TaskDescription, Priority, Category, index: idx, Date })
        await Task.save()

        res.json({ success: true, message: "your task has been created" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const edittask = async (req, res) => {
    const UserID = req.user.id
    const { TaskHeading, TaskDescription, Priority, Category, Projectname, Taskid } = req.body

    if (!TaskHeading || !Priority || !Category || !TaskDescription || !Projectname) {
        res.json({ success: false, message: "Please Enter all the details" })
    }
    if (!Taskid) {
        return res.json({ success: false, message: "Can't find your Task" })
    }

    try {
        const existingTask = await TaskModel.findById(Taskid)

        if (!existingTask) {
            return res.json({ success: false, message: "Can't find your Task" })
        }

        let id
        const existingProject = await ProjectModel.findOne({ Heading: Projectname })

        if (existingProject) {
            id = existingProject._id
        } else {
            const project = new ProjectModel({ Heading: Projectname, Userid: UserID })
            await project.save()
            id = project._id
        }

        existingTask.TaskHeading = TaskHeading
        existingTask.TaskDescription = TaskDescription
        existingTask.Priority = Priority
        existingTask.Category = Category
        existingTask.Projectid = id

        await existingTask.save()

        return res.json({ success: true, message: "detail has been updated" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const deletetask = async (req, res) => {

    const { Taskid } = req.body;

    if (!Taskid) {
        return res.json({ success: false, message: "Can't find your Task" })
    }
    try {
        const existingTask = await TaskModel.findById(Taskid)

        if (!existingTask) {
            return res.json({ success: false, message: "Can't find your Task" })
        }

        const fieldMap = {
            todo: "TodoTasks",
            inprogress: "InprogressTasks",
            completed: "CompletedTasks"
        }

        await ProjectModel.findByIdAndUpdate(existingTask.Projectid, {
            $inc: {
                [fieldMap[existingTask.Status]]: -1
            }
        }, { new: true })

        await TaskModel.findByIdAndDelete(Taskid)

        return res.json({ success: true, message: "Task has been deleted" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}