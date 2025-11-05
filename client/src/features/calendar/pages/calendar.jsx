import axios from 'axios'
import Tasks from '../components/Tasks'
import { useContext, useEffect, useState } from 'react'
import { FaCircleChevronLeft, FaCircleChevronRight, FaArrowLeftLong } from "react-icons/fa6"
import { FaPlus } from "react-icons/fa";
import { Appcontent } from '../../../context/Appcontext'
import { toast } from 'react-toastify'
import AddTask from '../components/addTask.jsx';
import assets from '../../../assets/assets.jsx';
import { useNavigate } from 'react-router-dom';

const calendar = () => {

  const { BackendURL, model, closemodel, statuscheck ,Streak } = useContext(Appcontent)
  const [currentdate, setcurrentdate] = useState(new Date())

  const navigate = useNavigate()

  const genrateMonthGrid = (year, month) => {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const days = []

    const startday = startDate.getDay()
    for (let i = 0; i < startday; i++) {
      days.push(null)
    }

    for (let d = 1; d <= endDate.getDate(); d++) {
      days.push(new Date(year, month, d))
    }

    for (let i = endDate.getDay() + 1; i <= 6; i++) {
      days.push(null)
    }

    return days
  }

  const formatDateKey = (year, month, date) => {
    const correctFormat = `${year}-${String(month + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`
    return correctFormat
  }

  const [taskcard, settaskcard] = useState(false)
  const [showtasks, setshowtasks] = useState(false)
  const [monthtasks, setmonthtasks] = useState([])
  const [taskslist, settaskslist] = useState([])
  const [tasksondate, settasksondate] = useState([])
  const [selecteddate, setselecteddate] = useState(formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))

  const year = currentdate.getFullYear()
  const month = currentdate.getMonth()

  const tasksperday = async (year, month) => {

    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    const tasks = []

    try {
      const res = await axios.post(BackendURL + `/calendar/tasksondate`, { month, year }, { withCredentials: true })

      if (res.data?.success) {

        settaskslist(res.data.grouped)

        for (let i = 0; i < startDate.getDay(); i++) {
          tasks.push(null)
        }

        for (let d = 1; d <= endDate.getDate(); d++) {
          tasks.push(res.data.grouped[formatDateKey(year, month, d)]?.length || "0")
        }

        for (let i = endDate.getDay() + 1; i <= 6; i++) {
          tasks.push(null)
        }

      } else {
        toast.error(res.data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }

    return tasks
  }

  const fetchtasks = async () => {
    const tasks = await tasksperday(year, month)
    setmonthtasks(tasks)
  }

  const [isLogged, setIsLogged] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);


  useEffect(() => {
    const checkStatus = async () => {
      try {
        const check = await statuscheck();

        if (!check) {
          toast.error("Not authorized. Please log in again");
          setIsLogged(false);
          navigate("/");
          return;
        }

        setIsLogged(true);
      } catch (error) {
        toast.error(error.message);
        setIsLogged(false);
        navigate("/");
      } finally {
        setAuthChecked(true)
      }
    };

    checkStatus();
  }, [navigate]);

  useEffect(() => {
    if (!authChecked || !isLogged) return
    Streak()
    fetchtasks()
  }, [year, month, authChecked, isLogged])

  useEffect(() => {
    if (!authChecked || !isLogged) return
    if (taskslist[selecteddate]) {
      settasksondate(taskslist[selecteddate])
    } else {
      settasksondate([])
    }
  }, [taskslist, selecteddate, authChecked, isLogged])

  const days = genrateMonthGrid(year, month)

  const tasks = (year, month, date) => {

    setselecteddate(formatDateKey(year, month, date))

    if (taskslist[formatDateKey(year, month, date)]) {
      settasksondate(taskslist[formatDateKey(year, month, date)])
    } else {
      settasksondate([])
    }
  }

  const istoday = (year, month, date) => (formatDateKey(year, month, date.getDate())) === selecteddate

  const isodateformate = new Date(selecteddate).toISOString()

  const prevmonth = () => { setcurrentdate(new Date(year, month - 1, 1)) }
  const nextmonth = () => { setcurrentdate(new Date(year, month + 1, 1)) }

  const prevyear = () => { setcurrentdate(new Date(year - 1, month, 1)) }
  const nextyear = () => { setcurrentdate(new Date(year + 1, month, 1)) }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  const weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <>
      <div className="flex-1 flex flex-col sm:flex-row gap-10 relative bg-[#080414] overflow-x-hidden">

        <div className={`h-full w-full fixed left-0 top-0 transition-all duration-200 z-10 bg-white/13 justify-center items-center ${taskcard ? "flex sm:hidden" : "hidden"} overflow-auto rounded-2xl`}>
          <AddTask settaskcard={settaskcard} isodateformate={isodateformate} fetchtasks={fetchtasks} />
        </div>

        <div className="flex flex-1 flex-col gap-6 relative sm:pr-18 xxl:pr-0">
          {/* addtask */}               
          <div className={`min-h-[710px] h-full w-full absolute transition-all hidden duration-200 z-10 bg-white/13 justify-center items-center  ${taskcard ? "sm:flex" : "sm:hidden"} overflow-auto rounded-2xl`}>
            <AddTask settaskcard={settaskcard} isodateformate={isodateformate} fetchtasks={fetchtasks} />
          </div>

          <header className="flex justify-end xs:justify-between items-baseline">
            <div className="text-lg xsm:text-2xl xlg:text-3xl pl-12 xs:pl-14 xsm:pl-18 md:pl-0 text-white capitalize font-semibold font-Josefin_Sans hidden xs:flex gap-2 xsm:gap-3 ">
              <p>{months[month]}</p>
              <p>{year}</p>
            </div>
            <div className="flex gap-3 xsm:gap-6">
              <div className="text-white w-fit flex items-center gap-3 xsm:gap-4 xlg:gap-6 bg-white/20 px-3 py-1 xsm:py-2 rounded-xl">
                <FaCircleChevronLeft onClick={() => prevmonth()} className='text-xs xsm:text-sm xlg:text-lg cursor-pointer hover:scale-110' />
                <p className="text-[11px] xsm:text-xs xlg:text-sm font-semibold capitalize">{months[month].slice(0, 3)}</p>
                <FaCircleChevronRight onClick={() => nextmonth()} className='text-xs xsm:text-sm xlg:text-lg cursor-pointer hover:scale-110' />
              </div>
              <div className="text-white w-fit flex items-center gap-3 xsm:gap-4 xlg:gap-6 bg-white/20 px-3 py-1 rounded-xl">
                <FaCircleChevronLeft onClick={() => prevyear()} className='text-xs xsm:text-sm xlg:text-lg cursor-pointer hover:scale-110' />
                <p className="text-[11px] xsm:text-xs xlg:text-sm font-semibold capitalize">{year}</p>
                <FaCircleChevronRight onClick={() => nextyear()} className='text-xs xsm:text-sm xlg:text-lg cursor-pointer hover:scale-110' />
              </div>
            </div>
          </header>
          <div className="grid grid-cols-7">
            {weeks.map((day, index) => (
              <div key={index} className="text-white/60 font-semibold text-sm sm:text-lg text-center ">
                {day}
              </div>
            ))}
          </div>

          <div className="min-h-[280px] xxs:min-h-[350px] xs:min-h-[450px] xsm:min-h-[600px] sm:h-2/3 max-h-[800px] xl:max-h-[1000px] xlg:flex-1 grid grid-cols-7 max-grid-rows-6 gap-1.5 xsm:gap-2 text-white">
            {days.map((date, i) => {
              return (
                <>
                  <div
                    onClick={() => {
                      tasks(year, month, date.getDate()),
                        setshowtasks(true)
                    }
                    }
                    key={i}
                    className={`group ${date && istoday(year, month, date) ? "bg-[#2c3155]" : "bg-[#393d55]"} cursor-pointer hover:bg-[#2c3155] hover:scale-95 p-2 xxs:p-3 xs:p-2 sm:p-3 rounded-lg xs:rounded-xl`}>
                    {date && (
                      <div className="flex flex-col h-full items-center xs:items-start justify-center xs:justify-between gap-2 xsm:gap-4 sm:gap-0">
                        <span className="xxs:text-lg xs:text-sm sm:text-lg font-medium">{date.getDate()}</span>
                        {monthtasks[i] !== null && (
                          <div className='hidden xs:flex gap-1 sm:gap-2 items-baseline font-medium'>
                            <span className={`text-xs sm:text-xl xlg:text-2xl font-bold ${monthtasks[i] === "0" ? "text-white/50 group-hover:text-white/70" : "text-red-400 group-hover:text-[#ec5c52]"}`}>{monthtasks[i]}</span>
                            <span className="text-xs xlg:text-sm sm:font-medium text-white/50 group-hover:text-white/70">Tasks</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )
            })}
          </div>
        </div>


        <div className={`${showtasks ? "sm:w-72" : "sm:w-5"} min-h-[715px] h-full py-4 sm:pl-8 border-t-2 sm:border-l-2 sm:border-t-0 border-white/40 relative sm:absolute xxl:relative sm:transition-all sm:duration-400 right-0 bg-[#080414]`}>
          <FaArrowLeftLong
            onClick={() => setshowtasks(!showtasks)}
            className={`text-white text-4xl bg-[#080414] p-2 border-[2px] border-white/40 rounded-full absolute top-3 -left-5 cursor-pointer hover:border-white hover:scale-110 transition-all duration-200 ${showtasks ? "rotate-180" : "rotate-0"} hidden sm:block`} />

          <div className={`flex flex-col min-h-[700px] h-full gap-8 ${showtasks ? "" : "sm:hidden"} transition-all duration-300`}>

            <div className="flex justify-between items-center pt-4 sm:pt-0">
              <p className="text-base xxs:text-lg xs:text-xl font-bold font-Josefin_Sans text-white ">{selecteddate} Tasks</p>
              <FaPlus
                onClick={() => {
                  settaskcard(true)
                  if (model?.type === "edit") {
                    closemodel()
                  }
                }}
                className='text-white text-2xl xs:text-3xl hover:bg-gray-400/20 hover:scale-115 transition-all duration-200 p-1.5 rounded-full cursor-pointer' />
            </div>

            <div className={`flex-1 pr-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg scrollbar-hover:scrollbar-thumb-gray-500 ${tasksondate.length > 0 ? "" : "flex"} justify-center items-center`}>
              <div className=" flex flex-col gap-5">
                {tasksondate.length > 0 ?
                  tasksondate.map((task, i) => (
                    <Tasks task={task} index={i} fetchtasks={fetchtasks} />
                  )) :
                  (
                    <div className="flex flex-col gap-10 px-10 sm:px-0">
                      <img src={assets.no_task} alt="" className="max-h-60 object-contain"/>
                      <p className="text-white text-center font-semibold font-Josefin_Sans">Zero tasks scheduled. My sole assignment for today is to maximize rest.</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default calendar