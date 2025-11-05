import express from "express"
import { userauth } from "../middlewear/userauth.js"
import { createproject , editproject , deleteproject , projectlist , createtask , edittask , deletetask , Taskslist ,AllTasks ,updateposition} from "../controllers/kanbancontroller.js"

const kanbanRoutes = express.Router()

kanbanRoutes.post("/createproject", userauth, createproject)
kanbanRoutes.post("/editproject", editproject)
kanbanRoutes.delete("/deleteproject", deleteproject)
kanbanRoutes.get("/projectlist", userauth, projectlist)

kanbanRoutes.post("/createtask/:id", userauth, createtask)
kanbanRoutes.post("/edittask", edittask)
kanbanRoutes.post("/updateposition", updateposition)
kanbanRoutes.delete("/deletetask", deletetask)
kanbanRoutes.get("/tasklist/:id", Taskslist)
kanbanRoutes.get("/alltasks", userauth , AllTasks)

export default kanbanRoutes