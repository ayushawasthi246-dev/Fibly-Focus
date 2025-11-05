import VerifiedUserModel from "../models/verified.js"

export const userdata = async (req, res) => {

    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "User ID not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        res.json({
            success: true,
            UserData: {
                Email: user.Email,
                Username: user.Username,
                CurrentStreak: user.CurrentStreak,
                LongestStreak: user.LongestStreak,
                HasSeenWelcome: user.HasSeenWelcome
            }
        })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const checkSeenWelcome = async (req, res) => {

    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "User ID not found" })
    }

    try {
        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        user.HasSeenWelcome = true
        await user.save()

        res.json({success: true,message: "SeenWelcome Updated"})

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const Streak = async (req, res) => {
    const UserID = req.user.id

    if (!UserID) {
        return res.json({ success: false, message: "User ID not found" })
    }
    try {

        const user = await VerifiedUserModel.findById(UserID)

        if (!user) {
            return res.json({ success: false, message: "User not exists" })
        }

        const today = new Date()
        const LastActiveDate = user.LastActive ? new Date(user.LastActive) : null


        if (!user.LastActive) {
            user.LongestStreak = 1
            user.CurrentStreak = 1
            user.LastActive = today
        } else {
            function getUTCMidnight(date) {
                return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
            }

            const todayMidnight = getUTCMidnight(new Date());
            const lastActiveMidnight = getUTCMidnight(new Date(user.LastActive));

            const diffDays = Math.floor((todayMidnight - lastActiveMidnight) / (1000 * 60 * 60 * 24))

            if (diffDays > 1) {
                user.CurrentStreak = 1
                user.LastActive = today
            }
            else if (diffDays === 0) {
                return res.json({ success: true, message: "Already updated today" });
            }
            else {
                user.CurrentStreak += 1
                user.LastActive = today
            }
        }

        if (user.CurrentStreak > user.LongestStreak) {
            user.LongestStreak = user.CurrentStreak
        }

        await user.save()

        return res.json({ success: true, message: "Data Updated" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}