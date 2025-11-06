import { useContext, useEffect, useState } from "react";
import { useMediaQuery } from "../../../components/breakpoints"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Appcontent } from "../../../context/Appcontext";
import { IoCloseSharp } from "react-icons/io5";
import assets from "../../../assets/assets";

const timer = () => {

  const isBelowMd = useMediaQuery("(max-width: 768px)")
  const { id } = useParams()
  const { BackendURL} = useContext(Appcontent)

  const [SessionDuration, setSessionDuration] = useState(0)
  const [BreakDuration, setBreakDuration] = useState(0)
  const [NumOfCycles, setNumOfCycles] = useState(0)
  const [turn, setturn] = useState("session")
  const [shownotification, setshownotification] = useState(true)

  const [sessiondone, setsessiondone] = useState(false)
  const navigate = useNavigate()

  const handlesessiondone = () => {
    setsessiondone(true)
    setturn("")
    setshownotification(false)
  }

  const fetchSessionData = async () => {
    try {
      const res = await axios.get(BackendURL + `/focusMode/sessionData/${id}`, { withCredentials: true })
      if (res.data?.success) {
        setSessionDuration(res.data.UserData.SessionDuration)
        settotaltime(res.data.UserData.SessionDuration * 60)
        settimeleft(res.data.UserData.SessionDuration * 60)
        setBreakDuration(res.data.UserData.BreakDuration)
        setNumOfCycles(res.data.UserData.Cycles)
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  const setcompleted = async () => {
    try {
      const res = await axios.post(BackendURL + `/focusMode/updateSession`, { sessionID: id }, { withCredentials: true })
      if (res.data?.success) {
        handlesessiondone()
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    fetchSessionData()
  }, [])

  const radius = isBelowMd ? 130 : 170
  const strokewidth = 10
  const circumference = 2 * Math.PI * radius
  const [runing, setruning] = useState(true)
  const [totaltime, settotaltime] = useState(0)
  const [timeleft, settimeleft] = useState(0)
  const [cyclesDone, setcyclesDone] = useState(1)


  useEffect(() => {
    if (runing) {
      const interval = setInterval(() => {
        settimeleft((prev) => {

          if (prev > 0) return prev - 1

          if (turn === "session") {
            if (cyclesDone == NumOfCycles) {
              clearInterval(interval)
              setruning(false)
              setcompleted()
              return 0
            }
            setshownotification(false)
            setturn("break")
            settotaltime(BreakDuration * 60)
            setTimeout(() => {
              setshownotification(true)
            }, 1000);
            return BreakDuration * 60
          } else {
            setcyclesDone((c) => c + 1)
            setshownotification(false)
            setturn("session")
            settotaltime(SessionDuration * 60)
            setTimeout(() => {
              setshownotification(true)
            }, 1000);
            return SessionDuration * 60
          }
        })
      }, 1000);
      return () => clearInterval(interval)
    }
  }, [timeleft, runing ])

  const progress = ((totaltime - timeleft) / totaltime) * circumference

  const size = 2 * radius + 2 * strokewidth
  const center = size / 2

  return (
    <div className='bg-[#080414] min-h-screen w-screen flex'>

      {shownotification && turn === "session" &&
        <div className={`h-34 xxs:h-36 xsm:h-44 w-72 xxs:w-80 xsm:w-96 fixed z-50 bottom-2 right-2 flex gap-2 justify-end pt-5 pr-6`}>
          <IoCloseSharp
            onClick={() => setshownotification(false)}
            className='bg-white p-1 text-xl rounded-full absolute right-5 top-0 opacity-50 cursor-pointer hover:opacity-75' />
          <div className="relative">
            <p className="absolute text-xs xsm:text-sm font-Share_Tech font-bold text-center px-2.5 xxs:px-0 -left-2 xxs:left-3 xsm:left-4 top-1 xxs:top-4">Focus up! Let’s get things done.</p>
            <img src={assets.message} alt="" className="" />
          </div>
          <img src={assets.focus_time} alt="" className="mt-4" />
        </div>}

      {shownotification && turn === "break" &&
        <div className={`h-34 xxs:h-36 xsm:h-44 w-72 xxs:w-80 xsm:w-96 fixed z-50 bottom-2 right-2 flex gap-2 justify-end pt-5 pr-6`}>
          <IoCloseSharp
            onClick={() => setshownotification(false)}
            className='bg-white p-1 text-xl rounded-full absolute right-5 top-0 opacity-50 cursor-pointer hover:opacity-75' />
          <div className="relative">
            <p className="absolute text-xs xsm:text-sm font-Share_Tech font-bold text-center px-2.5 xxs:px-0 left-2.5 xxs:left-8 xsm:left-10 top-3 xxs:top-4 xsm:top-5">Chill time! You earned it.</p>
            <img src={assets.message} alt="" className="" />
          </div>
          <img src={assets.break_time} alt="" className="mt-4" />
        </div>}

      <div className={`min-h-[400px] md:min-h-[550px] h-full w-full px-10 flex flex-col gap-3 xs:gap-5 justify-center items-center bg-[#080414] z-20 absolute transition-all duration-100  ${sessiondone ? "scale-100" : "scale-0"}`}>
        <img src={assets.session_completed} alt="" className="min-h-[120px] max-h-[300px]" />
        <p className="text-xs xs:text-base xlg:text-xl text-center font-Josefin_Sans font-bold text-white ">Congratulations! You've crossed the finish line of your focus session.</p>
        <button
          onClick={() => navigate("/Focus-mode")}
          className="text-white text-sm xxs:text-base py-1 xxs:py-2 px-6 xxs:px-8 font-Cuprum font-semibold rounded-lg xxs:rounded-xl cursor-pointer hover:scale-110 hover:bg-white/30 bg-white/20 mt-2 xs:mt-5 xlg:mt-8">close</button>
      </div>

      <div className={`min-h-[600px] md:min-h-[750px] flex flex-1 flex-col justify-center items-center gap-10 xs:gap-12 relative py-4 ${sessiondone ? "hidden" : "flex"}`}>

        <div className="text-lg md:text-2xl font-bold font-Asap flex gap-5 md:gap-9">
          <p className={`${turn === "session" ? "bg-gray-300/80 text-black" : "bg-white/20 text-white"}  py-2 px-9 md:px-12 rounded-xl transition-all duration-300`}>Focus</p>

          <p className={`${turn === "break" ? "bg-gray-300/80 text-black" : "bg-white/20 text-white"}  py-2 px-9 md:px-12 rounded-xl transition-all duration-300`}>Break</p>
        </div>

        <div className="flex justify-center items-center relative">
          <svg height={size} width={size} className="-rotate-90">
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
          <p className="text-white absolute text-4xl md:text-5xl font-bold font-Share_Tech">
            {String(Math.floor(timeleft / 3600)).padStart(2, "0")} : {String(Math.floor((timeleft % 3600) / 60)).padStart(2, "0")} : {String(timeleft % 60).padStart(2, "0")}
          </p>
        </div>

        <div className="flex gap-3 md:gap-8">
          {Array(NumOfCycles).fill().map((_, i) => (
            <div key={i} className={`size-3 md:size-5 rounded-full ${i < cyclesDone ? "bg-purple-500" : "bg-white"} transition-all duration-200`}></div>
          ))}
        </div>

        <button
          onClick={() => {
            setruning(false)
            navigate("/Focus-mode")
          }}
          className="text-base py-2.5 px-10 rounded-xl font-medium font-Josefin_Sans bg-white/10 text-white cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-white/20">End the session</button>

      </div>
    </div>
  )
}

export default timer
