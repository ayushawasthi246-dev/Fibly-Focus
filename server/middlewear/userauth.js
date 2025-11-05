import jwt from "jsonwebtoken"

export const userauth = async (req, res , next) => {

    const { token } = req.cookies

    if (!token) {
        return res.json({ success: false, message: "Not authorized . Please log in again" })
    }

    try {
        const userdata = jwt.verify(token, process.env.JWT_SecrectKey)

        if (userdata.id) {
            req.user = { id: userdata.id }
        } else {
            return res.json({ success: false, message: "Not authorized . Please log in again" })
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const verify = async (req, res , next) => {

    const { temptoken_signup } = req.cookies

    if (!temptoken_signup) {
        return res.json({ success: false, message: "Not authorized . Please singup again" })
    }

    try {
        const userdata = jwt.verify(temptoken_signup, process.env.JWT_SecrectKey)

        if (userdata.id) {
            req.user = { id: userdata.id }
        } else {
            return res.json({ success: false, message: "Not authorized . Please singup again" })
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

export const reset = async (req, res , next) => {

    const { temptoken_reset } = req.cookies

    if (!temptoken_reset) {
        return res.json({ success: false, message: "Not authorized . Please try again" })
    }

    try {
        const userdata = jwt.verify(temptoken_reset, process.env.JWT_SecrectKey)

        if (userdata.id) {
            req.user = { id: userdata.id }
        } else {
            return res.json({ success: false, message: "Not authorized . Please singup again" })
        }

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}