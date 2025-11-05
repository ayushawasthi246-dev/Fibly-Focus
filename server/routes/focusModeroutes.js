import express from "express"
import { userauth } from "../middlewear/userauth.js"
import { sessionHistory ,createSession ,updateSession ,getSessionData } from "../controllers/focusModecontroller.js";
const focusModeRoute = express.Router()

focusModeRoute.post("/sessionHistory", userauth, sessionHistory)
focusModeRoute.post("/createSession", userauth, createSession)
focusModeRoute.post("/updateSession", updateSession)
focusModeRoute.get("/sessionData/:id", userauth, getSessionData)

export default focusModeRoute
