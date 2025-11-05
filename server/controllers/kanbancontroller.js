import ProjectModel from "../models/project.js"
import TaskModel from "../models/Tasks.js"
import VerifiedUserModel from "../models/verified.js"

export const createproject = async (req, res) => {

    const UserID = req.user.id
    const { Heading, Color } = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User not found " })
    }

    if (!Heading) {
        return res.json({ success: false, message: "Please enter the project name" })
    }

    try {

        const user = await VerifiedUserModel.findById(UserID)
        const existingProjectname = await ProjectModel.findOne({ Heading })

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        if (existingProjectname) {
            return res.json({ success: false, message: "Please enter a different project name that already exists" })
        }

        const project = new ProjectModel({ Heading, Color: Color || undefined, Userid: UserID })
        await project.save()

        res.json({
            success: true,
            ProjectID: project._id
        })

        res.json({ success: true, message: "your Project has been updated" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const editproject = async (req, res) => {

    const { Heading, Color, id } = req.body

    if (!Heading) {
        return res.json({ success: false, message: "Please enter the project name" })
    }
    if (!id) {
        return res.json({ success: false, message: "Can't find your project" })
    }

    try {
        const existingProjectname = await ProjectModel.findOne({
            Heading,
            _id: { $ne: id }
        })
        const existingProject = await ProjectModel.findById(id)

        if (existingProjectname) {
            return res.json({ success: false, message: "Please enter a different project name that already exists" })
        }
        if (!existingProject) {
            return res.json({ success: false, message: "Can't find your project" })
        }

        existingProject.Heading = Heading
        existingProject.Color = Color
        await existingProject.save()

        return res.json({ success: true, message: "detail has been updated" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const deleteproject = async (req, res) => {

    const { id } = req.body;

    if (!id) {
        return res.json({ success: false, message: "Can't find your project" })
    }
    try {
        const existingProject = await ProjectModel.findById(id)

        if (!existingProject) {
            return res.json({ success: false, message: "Can't find your project" })
        }

        const result = await TaskModel.deleteMany({ Projectid: id })
        await ProjectModel.findByIdAndDelete(id)

        return res.json({ success: true, message: `Project and all ${result.deletedCount} Tasks has been deleted` })

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
                Color: project.Color,
                ProjectID: project._id
            }))
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


export const createtask = async (req, res) => {

    const UserID = req.user.id
    const { id } = req.params
    const { TaskHeading, TaskDescription, Priority, Category, Date, idx } = req.body

    if (!UserID || !id) {
        res.json({ success: false, message: "Something went missing . try again" })
    }

    if (!TaskHeading || !Priority || !Category || !TaskDescription || !Date) {
        res.json({ success: false, message: "Please Enter all the details" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)
        const existingProject = await ProjectModel.findById(id)

        if (!user) {
            res.json({ success: false, message: "user does not exists" })
        }

        if (!existingProject) {
            res.json({ success: false, message: "can't find your project" })
        }

        const Task = new TaskModel({ Userid: UserID, Projectid: id, TaskHeading, TaskDescription, Priority, Category, index: idx, Date })
        await Task.save()

        existingProject.TodoTasks += 1
        await existingProject.save()

        res.json({ success: true, message: "your task has been created" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const updateposition = async (req, res) => {
    const { Taskid, newcol, newidx, oldcol } = req.body

    if (!Taskid) {
        res.json({ success: false, message: "can't find your task" })
    }

    if (!newcol) {
        res.json({ success: false, message: "somthing is missing . try again  newcol" })
    }

    if(newcol === oldcol){
        return;
    }

    if (newidx === undefined || newidx === null) {
        res.json({ success: false, message: `somthing is missing . try again!!` })
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
        };


        existingTask.Status = newcol
        existingTask.index = newidx
        await existingTask.save()

        await ProjectModel.findByIdAndUpdate(
            existingTask.Projectid,
            {
                $inc: {
                    [fieldMap[oldcol]]: -1,
                    [fieldMap[newcol]]: 1
                }
            },
            { new: true }
        );

        return res.json({ success: true, message: "detail has been updated" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const edittask = async (req, res) => {

    const { TaskHeading, TaskDescription, Priority, Category, Date, Taskid } = req.body

    if (!TaskHeading || !Priority || !Category || !TaskDescription || !Date) {
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

        existingTask.TaskHeading = TaskHeading
        existingTask.TaskDescription = TaskDescription
        existingTask.Priority = Priority
        existingTask.Category = Category
        existingTask.Date = Date
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

export const AllTasks = async (req, res) => {

    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "Can't the user" })
    }

    try {
        const existinguser = await VerifiedUserModel.findById(UserID)

        if (!existinguser) {
            return res.json({ success: false, message: "user not found" })
        }

        const Tasklist = await TaskModel.find({ Userid: UserID })

        res.json({
            success: true,
            TaskData: Tasklist.map(Task => ({
                TaskID: Task._id,
                TaskHeading: Task.TaskHeading,
                TaskDescription: Task.TaskDescription,
                Status: Task.Status,
                Priority: Task.Priority,
                Category: Task.Category
            }))
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const Taskslist = async (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.json({ success: false, message: "Can't find your project" })
    }

    try {
        const existingProject = await ProjectModel.findById(id)

        if (!existingProject) {
            return res.json({ success: false, message: "Can't find your project" })
        }

        const Tasklist = await TaskModel.find({ Projectid: id }).sort({ index: 1 })

        const columns = { todo: [], inprogress: [], completed: [] }

        for (const task of Tasklist) {
            columns[task.Status].push(task)
        }

        const bulkOps = []

        for (const col in columns) {
            let normalizedIndex = 1
            for (const task of columns[col]) {
                task.index = normalizedIndex++
                bulkOps.push({
                    updateOne: {
                        filter: { _id: task._id },
                        update: { $set: { index: task.index } }
                    }
                })
            }
        }

        await TaskModel.bulkWrite(bulkOps)

        const TaskData = Tasklist.map(Task => ({
            TaskID: Task._id,
            TaskHeading: Task.TaskHeading,
            TaskDescription: Task.TaskDescription,
            Status: Task.Status,
            Priority: Task.Priority,
            Description: Task.Description,
            Category: Task.Category,
            index: Task.index,
            Date: Task.Date,
        }))

        res.json({
            success: true,
            TaskData,
            Projectname: existingProject.Heading
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
