import FocusModeModel from "../models/FocusMode.js"
import PromodoroModel from "../models/promodoro.js"
import VerifiedUserModel from "../models/verified.js"
import TaskModel from "../models/Tasks.js"

export const FocusData = async (req, res) => {
    const UserID = req.user.id
    const {timeline} = req.body

    if (!UserID) {
        return res.json({ success: false, message: "UserID not found" })
    }

    try {

        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        const period = timeline === "week" ? 7 : 30

        const today = new Date()
        const start = new Date()
        start.setDate(today.getDate() - period)

        start.setHours(0, 0, 0, 0)
        today.setHours(23, 59, 59, 999)

        const focusMode = await FocusModeModel.find({
            Userid: UserID,
            createdAt: { $gte: start, $lte: today },
            Completed: true
        }).sort({ Date: 1, index: 1 })

        const promodoro = await PromodoroModel.find({
            Userid: UserID,
            createdAt: { $gte: start, $lte: today },
            Completed: true
        }).sort({ Date: 1, index: 1 })

        let focusModeTime = 0
        let promodoroTime = 0

        let focusByDays = {}
        let focusModeByDays = {}
        let promodoroByDays = {}
        let focusByCategory = {}

        focusMode.forEach(session => {
            const day = session.createdAt.getDay()
            const category = session.SessionCategory
            const duration = session.SessionDuration * session.NumberOfCycle

            focusByDays[day] = Math.round(focusByDays[day] || 0) + duration
            focusModeByDays[day] = Math.round(focusModeByDays[day] || 0) + duration
            focusByCategory[category] = Math.round(focusByCategory[category] || 0) + duration
            focusModeTime += duration
        });

        promodoro.forEach(session => {
            const day = session.createdAt.getDay()
            const duration = session.Duration

            focusByDays[day] = Math.round(focusByDays[day] || 0) + duration
            promodoroByDays[day] = Math.round(promodoroByDays[day] || 0) + duration
            promodoroTime += duration
        });

        let prevFocusModeTime = 0
        let prevPromodoroTime = 0

        const prevEnd = start
        const prevStart = new Date()
        prevStart.setDate(prevEnd.getDate() - period)

        prevStart.setHours(0, 0, 0, 0)
        prevEnd.setHours(23, 59, 59, 999)

        const prevFocusMode = await FocusModeModel.find({
            Userid: UserID,
            createdAt: { $gte: prevStart, $lte: prevEnd },
            Completed: true
        }).sort({ Date: 1, index: 1 })

        const prevPromodoro = await PromodoroModel.find({
            Userid: UserID,
            createdAt: { $gte: prevStart, $lte: prevEnd },
            Completed: true
        }).sort({ Date: 1, index: 1 })

        prevFocusMode.forEach(session => {
            const duration = session.SessionDuration * session.NumberOfCycle
            prevFocusModeTime += duration
        });

        prevPromodoro.forEach(session => {
            const duration = session.Duration
            prevPromodoroTime += duration
        });

        const prevTotalTime = prevFocusModeTime + prevPromodoroTime
        const prevAvgDailyTime = Math.floor(prevTotalTime / period)

        const totalTime = promodoroTime + focusModeTime
        const avgDailyTime = Math.floor(totalTime / period)

        return res.json({ success: true, data: { totalTime, avgDailyTime, prevTotalTime, prevAvgDailyTime, focusByDays, focusByCategory , focusModeByDays , promodoroByDays } })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const TasksData = async (req, res) => {
    const UserID = req.user.id
    const {timeline} = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User id not found" })
    }

    try {
        const user = VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        const period = timeline === "week" ? 7 : 30

        const today = new Date()
        const start = new Date()
        start.setDate(today.getDate() - period)

        start.setHours(0, 0, 0, 0)
        today.setHours(23, 59, 59, 999)

        const Tasks = await TaskModel.find({
            Userid: UserID,
            createdAt: { $gte: start, $lte: today },
        }).sort({ Date: 1, index: 1 })

        const prevEnd = start
        const prevStart = new Date()
        prevStart.setDate(prevEnd.getDate() - period)

        prevStart.setHours(0, 0, 0, 0)
        prevEnd.setHours(23, 59, 59, 999)

        const PrevTasks = await TaskModel.find({
            Userid: UserID,
            createdAt: { $gte: prevStart, $lte: prevEnd },
        }).sort({ Date: 1, index: 1 })

        let prevTotalTasks = 0

        PrevTasks.forEach(()=>{
            prevTotalTasks += 1
        })

        let TotalTasks = 0
        let TaskByDaysRemains = {}
        let TaskByDaysCompleted = {}
        let TaskByCategory = {}
        let TaskByPriority = {}

        Tasks.forEach((task) => {
            const day = task.createdAt.getDay()
            const category = task.Category
            const Priority = task.Priority

            TotalTasks += 1

            TaskByCategory[category] = (TaskByCategory[category] || 0) + 1
            TaskByPriority[Priority] = (TaskByPriority[Priority] || 0) + 1

            if (task.Status !== "completed") {
                TaskByDaysRemains[day] = (TaskByDaysRemains[day] || 0) + 1
            } else {
                TaskByDaysCompleted[day] = (TaskByDaysCompleted[day] || 0) + 1
            }
        })

        res.json({success:true , data : {TotalTasks , prevTotalTasks , TaskByDaysRemains , TaskByDaysCompleted , TaskByCategory , TaskByPriority}})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

