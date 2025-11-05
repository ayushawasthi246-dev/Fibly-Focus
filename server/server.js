import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectdb from './config/mongodb.js';
import authRouter from './routes/authroutes.js';
import userRoute from './routes/userroute.js';
import kanbanRoutes from './routes/kanbanroutes.js';
import calendarRoute from './routes/calendarroute.js';
import promodoroRoute from './routes/promodororoutes.js';
import focusModeRoute from './routes/focusModeroutes.js';
import dashboardRoute from './routes/dashboardroute.js';
import anaylticsRoute from './routes/analyticsroutes.js';

const app = express();
app.use(express.json());

const port = process.env.port || 4000;
connectdb();

const allowedorigin = ['http://localhost:5173']

app.use(cookieParser());
app.use(cors({ origin : allowedorigin , credentials: true }));

app.use("/auth", authRouter)
app.use("/user", userRoute)
app.use("/kanban", kanbanRoutes)
app.use("/calendar", calendarRoute)
app.use("/promodoro", promodoroRoute)
app.use("/focusMode", focusModeRoute)
app.use("/dashboard", dashboardRoute)
app.use("/analytics", anaylticsRoute)
app.get("/", (req, res) => {
    res.send("Its Working fine!!")
})

app.listen(port, () => { console.log(`Server is runing on the Port : ${port}`) })
