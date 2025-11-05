import express from "express";
import { userauth } from "../middlewear/userauth.js";
import { userdata ,Streak , checkSeenWelcome } from "../controllers/usercontroller.js";

const userRoute = express.Router()

userRoute.get("/data", userauth, userdata)
userRoute.put("/Streak", userauth, Streak)
userRoute.put("/CheckWelcome", userauth, checkSeenWelcome)

export default userRoute