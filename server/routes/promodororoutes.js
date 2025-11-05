import express from "express"
import { userauth } from "../middlewear/userauth.js"
import { todaytask ,createSession ,updateSession } from "../controllers/promodorocontroller.js"
const promodoroRoute = express.Router()

promodoroRoute.post("/todaytask", userauth, todaytask)
promodoroRoute.post("/createSession", userauth, createSession)
promodoroRoute.post("/updateSession", updateSession)

export default promodoroRoute
