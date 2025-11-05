import FocusModeModel from "../models/FocusMode.js"
import VerifiedUserModel from "../models/verified.js"

export const sessionHistory = async (req, res) => {

    const UserID = req.user.id
    const { period } = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            res.json({ success: false, message: "user does not exists" })
        }

        const today = new Date()
        let start
        let end

        if (period === "week") {
            const day = today.getDay()
            const diffToMonday = (day + 6) % 7
            start = new Date(today)
            start.setDate(today.getDate() - diffToMonday)
            start.setHours(0, 0, 0, 0)

            end = new Date(start)
            end.setDate(start.getDate() + 6)
            end.setHours(23, 59, 59, 999)
        }

        if (period === "month") {
            start = new Date(today.getFullYear(), today.getMonth(), 1)
            start.setHours(0, 0, 0, 0)

            end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            end.setHours(23, 59, 59, 999)
        }

        const periodHistory = await FocusModeModel.find({
            Userid: UserID,
            createdAt: { $gte: start, $lte: end }
        });

        const History = await Promise.all(
            periodHistory.map(async (session) => {
                return {
                    Title: session.SessionTitle,
                    Category: session.SessionCategory,
                    SessionDuration: session.SessionDuration,
                    BreakDuration: session.BreakDuration,
                    cycles: session.NumberOfCycle,
                    Completed: session.Completed,
                };
            })
        );

        res.json({ success: true, History })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const createSession = async (req, res) => {

    const UserID = req.user.id
    const { Title, Category, SessionsDuration, BreakDuration, cycles } = req.body

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }

    if (!Title || Title.trim() === "") {
        return res.json({ success: false, message: "Please enter some title for the session" })
    }

    if (SessionsDuration == "0") {
        return res.json({ success: false, message: "You must set session duration it can't be 0" })
    }
    if (BreakDuration == "0") {
        return res.json({ success: false, message: "You must set break duration it can't be 0" })
    }
    if (cycles == "0") {
        return res.json({ success: false, message: "There should be atleast 1 cycle" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            res.json({ success: false, message: "user does not exists" })
        }

        const duration = (cycles * SessionsDuration) + (cycles * BreakDuration) - BreakDuration

        const session = new FocusModeModel({ Userid: UserID, SessionTitle: Title.trim(), SessionCategory: Category, SessionDuration: SessionsDuration, BreakDuration: BreakDuration, NumberOfCycle: cycles, Duration: duration })
        await session.save()

        const ID = session._id
        return res.json({ success: true, ID })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const updateSession = async (req, res) => {

    const { sessionID } = req.body

    try {
        const existingSession = await FocusModeModel.findById({ _id: sessionID })

        if (existingSession) {
            const createdAt = existingSession.createdAt
            const targetedTime = new Date(createdAt.getTime() + existingSession.Duration * 60 * 1000)

            if (existingSession.Completed) {
                return res.json({ success: false, message: "Session already completed" });
            }

            if (new Date() < targetedTime) {
                return res.json({ success: false, message: " Fastest focus session ever recorded… NOT! Try again 😏" })
            } else {
                existingSession.Completed = true
                await existingSession.save()
            }
        } else {
            return res.json({ success: false, message: "Can't find your session" })
        }
        return res.json({ success: true, message: "Session completed successfully 🎉" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const getSessionData = async (req, res) => {

    const UserID = req.user.id
    const { id } = req.params

    if (!UserID) {
        return res.json({ success: false, message: "User not found" })
    }
    if (!id) {
        return res.json({ success: false, message: "Session not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)
        const session = await FocusModeModel.findById(id)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }
        if (!session) {
            return res.json({ success: false, message: "there is no Session" })
        }

        res.json({
            success: true,
            UserData: {
                SessionDuration: session.SessionDuration,
                BreakDuration: session.BreakDuration,
                Cycles: session.NumberOfCycle,
                Duration: session.Duration,
            }
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}