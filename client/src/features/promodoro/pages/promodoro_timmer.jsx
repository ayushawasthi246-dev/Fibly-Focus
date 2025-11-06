import { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6"
import { FaPause, FaPlay } from "react-icons/fa";
import { RiResetLeftFill } from "react-icons/ri";
import { Appcontent } from "../../../context/Appcontext";
import { useMediaQuery } from "../../../components/breakpoints";
import axios from "axios";
import assets from "../../../assets/assets";
import { toast } from "react-toastify";

export default function PomodoroCircle() {

  const isBelowMd = useMediaQuery("(max-width: 768px)")

  const radius = isBelowMd ? 130 : 170
  const strokewidth = 10
  const circumference = 2 * Math.PI * radius
  const [showtasks, setshowtasks] = useState(false)
  const [runing, setruning] = useState(false)
  const [start, setstart] = useState(false)
  const [totaltime, settotaltime] = useState(25 * 60)
  const [timeleft, settimeleft] = useState(totaltime)
  const [Tasks, setTasks] = useState([])
  const [sessionid, setsessionid] = useState("")

  const { BackendURL, Streak } = useContext(Appcontent)

  const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`

  const fetchtasks = async () => {
    try {
      const res = await axios.post(BackendURL + '/promodoro/todaytask', { today }, { withCredentials: true })
      if (res.data?.success) {
        setTasks(res.data.TasksData)
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    fetchtasks()
    Streak()
  }, [])

  const timers = ["5", "25", "45"]
  const [selectedtimer, setselectedtimer] = useState(1)

  const set = (value, i) => {
    setselectedtimer(i)
    settotaltime(value * 60)
    setruning(false)
    setstart(false)
    settimeleft(value * 60)
  }

  const createSession = async () => {
    try {
      const res = await axios.post(BackendURL + '/promodoro/createSession', { duration: timers[selectedtimer] }, { withCredentials: true })
      if (res.data?.success) {
        setsessionid(res.data.ID)
      } else {
        setsessionid("")
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  const [timercompleted, settimercompleted] = useState(false)

  const handletaskdone = () => {
    settimercompleted(true)
    setTimeout(() => {
      settimercompleted(false)
    }, 6000);
  }

  const updateSession = async () => {
    try {
      const res = await axios.post(BackendURL + '/promodoro/updateSession', { sessionID: sessionid }, { withCredentials: true })

      if (res.data?.success) {
        handletaskdone()
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    if (runing) {
      if (timeleft <= 0) {
        updateSession()
        return;
      }
      const interval = setInterval(() => {
        settimeleft((prev) => prev - 1)
      }, 1000);
      return () => clearInterval(interval)
    }
  }, [timeleft, runing ])


  const progress = ((totaltime - timeleft) / totaltime) * circumference

  const size = 2 * radius + 2 * strokewidth
  const center = size / 2

  return (
    <div className="  flex-1 flex relative bg-[#080414] overflow-x-hidden">
      
      <div className="min-h-[500px] md:min-h-[700px] flex flex-1 flex-col justify-center items-center gap-10 xs:gap-14 relative ">
        <div className="text-white flex gap-4 xxs:gap-7 md:gap-10 text-xs xxs:text-sm md:text-lg font-semibold font-Lexend">
          {timers.map((val, i) => (
            <p
              key={i}
              onClick={() => set(val, i)}
              className={`py-2 px-5 md:px-8 rounded-xl md:rounded-2xl ${selectedtimer === i ? "bg-[#3c2f63]" : "bg-[#3c2f63]/60"} hover:bg-[#3c2f63] cursor-pointer`}>{String(val).padStart(2, "0")} min</p>
          ))}
        </div>
        <div className="flex justify-center items-center relative">
          <svg height={size} width={size} className="-rotate-90 ">
            <circle
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokewidth}
              stroke="gray"
              fill="transparent"
            />

            <circle
              cx={center}
              cy={center}
              r={radius}
              strokeWidth={strokewidth}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              stroke="purple"
              strokeLinecap="round"
              fill="transparent"
              style={{ transition: `${runing ? "stroke-dashoffset 1s linear" : "none"}` }}
            />
          </svg>
          <p className="text-white absolute text-5xl md:text-6xl font-bold font-Share_Tech">
            {String(Math.floor(timeleft / 60)).padStart(2, "0")} : {String(timeleft % 60).padStart(2, "0")}
          </p>
        </div>
        <div className="flex items-center xxs:gap-14 md:gap-20 text-white/80 font-semibold font-Asap">
          {start ? runing ? (
            <div
              onClick={() => setruning(prev => (!prev))}
              className="flex items-baseline xxs:items-center gap-2 xxs:gap-4 cursor-pointer hover:scale-105 hover:text-white transition-all duration-200 w-32">
              <FaPause className="text-sm xxs:text-base md:text-xl" />
              <p className="text-base xxs:text-xl md:text-2xl">Pause</p>
            </div>
          ) : (
            <div
              onClick={() => setruning(prev => (!prev))}
              className="flex items-baseline xxs:items-center gap-2 xxs:gap-4 cursor-pointer hover:scale-105 hover:text-white transition-all duration-200 w-32">
              <FaPlay className="text-sm xxs:text-base md:text-xl" />
              <p className="text-base xxs:text-xl md:text-2xl">Resume</p>
            </div>
          ) : (
            <div
              onClick={() => {
                setstart(true),
                  setruning(prev => (!prev)),
                  createSession()
              }}
              className="flex items-baseline xxs:items-center gap-2 xxs:gap-4 cursor-pointer hover:scale-105 hover:text-white transition-all duration-200 w-32">
              <FaPlay className="text-sm xxs:text-base md:text-xl" />
              <p className="text-base xxs:text-xl md:text-2xl">Play</p>
            </div>
          )}
          <div
            onClick={() => { setruning(false), settimeleft(totaltime), setstart(false) }}
            className="flex items-baseline xxs:items-center gap-2 xxs:gap-4 cursor-pointer hover:scale-105 hover:text-white transition-all duration-200 w-fit">
            <RiResetLeftFill className="text-sm xxs:text-xl md:text-2xl" />
            <p className="text-base xxs:text-xl md:text-2xl">Restart</p>
          </div>
        </div>
      </div>

      <div className={`${showtasks ? "w-72" : "w-5"} min-h-[500px] md:min-h-[700px] h-full max-w-full py-4 pl-8 border-l-2 border-white/40 absolute xxl:relative transition-all duration-400 right-0 bg-[#080414] hidden xsm:flex gap-8 flex-col `}>

        <FaArrowLeftLong
          onClick={() => setshowtasks(!showtasks)}
          className={`text-white text-4xl bg-[#080414] p-2 border-[2px] border-white/40 rounded-full absolute top-3 -left-5 cursor-pointer hover:border-white hover:scale-110 transition-all duration-200 ${showtasks ? "rotate-180" : "rotate-0"} `} />

        <p className="text-xl font-bold font-Josefin_Sans text-white ">Today Tasks</p>
        <div className={`flex-1 ${Tasks.length > 0 ? "" : "justify-center items-center"} flex flex-col gap-8 ${showtasks ? "block" : "hidden"} transition-all duration-300 overflow-y-auto`}>
          {Tasks.length > 0 ? (
            Tasks.map((task, i) => (
              <div
                key={i}
                className="border-l-4 border-purple-500 px-4 py-1">
                <p className="text-sm text-white/70 mb-1 truncate">{task.Projectname}</p>
                <p className="text-white truncate">{task.Heading}</p>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-10">
              <img src={assets.no_task} alt="" className="" />
              <p className="text-white text-center font-semibold font-Josefin_Sans">Zero tasks scheduled. My sole assignment for today is to maximize rest.</p>
            </div>
          )}
        </div>
      </div>

      <div className={`h-full w-full flex flex-col gap-5 justify-center items-center bg-[#080414] absolute transition-all duration-100 ${timercompleted ? "scale-100" : "scale-0"}`}>
        <img src={assets.timmer_completed} alt="" className="h-1/2" />
        <p className="text-xl font-Josefin_Sans font-bold text-white ">Well done! You completed the time.</p>
        <button
          onClick={() => settimercompleted(false)}
          className="text-white text-base py-2 px-8 font-Cuprum font-semibold rounded-xl cursor-pointer hover:scale-110 hover:bg-white/30 bg-white/20 mt-8">close</button>
      </div>
    </div>

  );
}