import express from "express"
import { userauth } from "../middlewear/userauth.js"
import { projectdata , stats , pinproject} from "../controllers/dashboardcontroller.js"

const dashboardRoute = express.Router()

dashboardRoute.get("/projectsData", userauth, projectdata)
dashboardRoute.get("/statsData", userauth, stats)
dashboardRoute.post("/pinproject", pinproject)

export default dashboardRoute
