import express from "express"
import { userauth } from "../middlewear/userauth.js"
import { taskslistofmonth , checkmarked , projectlist ,createtask,edittask,deletetask } from "../controllers/calendarcontroller.js"

const calendarRoute = express.Router()

calendarRoute.post("/tasksondate", userauth, taskslistofmonth)
calendarRoute.post("/checkmarked", checkmarked)
calendarRoute.get("/projects", userauth, projectlist)
calendarRoute.post("/createtask", userauth, createtask)
calendarRoute.post("/edittask", userauth, edittask)
calendarRoute.delete("/deletetask", deletetask)

export default calendarRoute
