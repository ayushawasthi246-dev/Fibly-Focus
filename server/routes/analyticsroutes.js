import express from "express";
import { userauth } from "../middlewear/userauth.js"
import { FocusData ,TasksData } from "../controllers/analyticscontroller.js";

const anaylticsRoute = express.Router();

anaylticsRoute.post('/timespend', userauth, FocusData)
anaylticsRoute.post('/taskdata', userauth, TasksData)

export default anaylticsRoute;
