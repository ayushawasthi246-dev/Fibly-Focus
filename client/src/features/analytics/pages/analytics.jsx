import { WiTime7 } from "react-icons/wi";
import { IoIosArrowRoundDown } from "react-icons/io";
import { MdTaskAlt } from "react-icons/md";
import { LuCalendarCheck2 } from "react-icons/lu";
import { BiSolidMedal } from "react-icons/bi";
import { FaFire } from "react-icons/fa";
import StackedAreaChart from '../components/AreaChart.jsx';
import StackedBarChart from "../components/Barchart.jsx";
import PieChartCustom from '../components/PieChart.jsx';
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Appcontent } from "../../../context/Appcontext.jsx";
import { toast } from "react-toastify";

const analytics = () => {

  const { BackendURL, Streak } = useContext(Appcontent)

  const [focusData, setFocusData] = useState([])
  const [taskData, setTaskData] = useState([])

  const [currentStreak, setCurrentStreak] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)

  const [timeline, settimeline] = useState("week")

  const formatMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    return `${hours}h ${minutes}m`;
  }

  const percentageChanged = (current, prev) => {
    if (prev === 0) return 0
    const change = Math.floor(((current - prev) / prev) * 100)
    return change
  }

  const timespend = async () => {
    try {
      const res = await axios.post(BackendURL + '/analytics/timespend', { timeline: timeline }, { withCredentials: true })

      if (res.data?.success) {
        setFocusData(res.data.data)
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  const userdata = async () => {
    try {
      const res = await axios.get(BackendURL + '/user/data', { withCredentials: true })
      if (res.data?.success) {
        setCurrentStreak(res.data.UserData.CurrentStreak)
        setLongestStreak(res.data.UserData.LongestStreak)
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  const taskdata = async () => {
    try {
      const res = await axios.post(BackendURL + '/analytics/taskdata', { timeline: timeline }, { withCredentials: true })

      if (res.data?.success) {
        setTaskData(res.data.data)
      } else {
        toast.error(res.data?.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  useEffect(() => {
    timespend()
    taskdata()
    userdata()
    Streak()
  }, [timeline])

  const totalFocusModeTime = Object.values(focusData?.focusByCategory || {})?.reduce((acc, val) => acc + val, 0)

  return (
    <div className="flex flex-1 relative overflow-x-hidden flex-col gap-5 py-1.5 lg:py-1 h-full w-full">

      <div className="flex justify-between pl-12 xsm:pl-15 md:pl-0">
        <p className="text-white text-sm xxs:text-lg xsm:text-2xl font-Lexend font-bold  xxs:-translate-y-1 lg:-translate-y-0">Analytics</p>
        <div className="flex gap-2 xxs:gap-3 xsm:gap-5">
          <p
            onClick={() => settimeline("week")}
            className={`py-1 xsm:py-1.5 px-3 xxs:px-4 xsm:px-5 text-xs xsm:text-sm font-Asap rounded-lg ${timeline === "week" ? "bg-white text-black " : "text-white bg-[#343852]/70"} font-semibold cursor-pointer hover:scale-110 hover:font-bold transition-all duration-150`}>Week</p>
          <p
            onClick={() => settimeline("month")}
            className={`py-1 xsm:py-1.5 px-3 xxs:px-4 xsm:px-5 text-xs xsm:text-sm font-Asap rounded-lg ${timeline === "month" ? "bg-white text-black " : "text-white bg-[#343852]/70"} font-semibold cursor-pointer hover:scale-110 hover:font-bold transition-all duration-150`}>Month</p>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-4 xl:gap-8 lg:min-h-34 w-full">
        <div className="flex flex-col xsm:flex-row gap-4 xl:gap-8 w-full lg:w-3/4">

          <div className="flex xsm:flex-col xlg:flex-row lg:flex-col lg:justify-center xlg:items-center lg:items-start gap-4 xsm:gap-2 xlg:gap-4 lg:gap-2 xsm:w-1/3 rounded-xl bg-[#343852]/40 p-4 lg:px-5 lg:p-0">
            <WiTime7 className='text-white size-9 xsm:size-11 rounded-full bg-purple-500 p-1.5' />
            <div className="flex flex-col gap-1 lg:gap-2">
              <div className="flex gap-2">
                <p className="text-white font-bold text-xs xsm:text-base lg:text-lg">{formatMinutes(focusData.totalTime)}</p>
                <div className={`flex items-center gap-1 ${(percentageChanged(focusData.totalTime, focusData.prevTotalTime)) > 0 ? "text-green-400" : "text-red-500"} `}>
                  <p className="text-xs xsm:text-sm">{percentageChanged(focusData.totalTime, focusData.prevTotalTime)}%</p>
                  <IoIosArrowRoundDown className={`text-base xsm:text-xl ${(percentageChanged(focusData.totalTime, focusData.prevTotalTime)) > 0 ? "rotate-180" : ""} `} />
                </div>
              </div>
              <p className="text-white/30 text-xs lg:text-sm font-semibold">Total Focus Hours</p>
            </div>

          </div>

          <div className="flex xsm:flex-col xlg:flex-row lg:flex-col lg:justify-center xlg:items-center lg:items-start gap-4 xsm:gap-2 xlg:gap-4 lg:gap-2 xsm:w-1/3 rounded-xl bg-[#343852]/40 p-4 lg:px-5 lg:p-0">
            <MdTaskAlt className='size-9 xsm:size-11 rounded-full bg-[#FAD156] p-1.5' />
            <div className="flex flex-col gap-1 lg:gap-2">
              <div className="flex gap-2">
                <p className="text-white font-bold text-xs xsm:text-base lg:text-lg">{taskData.TotalTasks} Taks</p>
                <div className={`flex items-center gap-1 ${(percentageChanged(taskData.TotalTasks, taskData.prevTotalTasks)) > 0 ? "text-green-400" : "text-red-500"}`}>
                  <p className="text-xs xsm:text-sm">{percentageChanged(taskData.TotalTasks, taskData.prevTotalTasks)}%</p>
                  <IoIosArrowRoundDown className={`text-base xsm:text-xl ${(percentageChanged(taskData.TotalTasks, taskData.prevTotalTasks)) > 0 ? "rotate-180" : ""}`} />
                </div>
              </div>
              <p className="text-white/30 text-xs lg:text-sm font-semibold">Tasks Completed</p>
            </div>

          </div>

          <div className="flex xsm:flex-col xlg:flex-row lg:flex-col lg:justify-center xlg:items-center lg:items-start gap-4 xsm:gap-2 xlg:gap-4 lg:gap-2 xsm:w-1/3 rounded-xl bg-[#343852]/40 p-4 lg:px-5 lg:p-0">
            <LuCalendarCheck2 className='text-white size-9 xsm:size-11 rounded-full bg-purple-500 p-2' />
            <div className="flex flex-col gap-1 lg:gap-2">
              <div className="flex gap-2">
                <p className="text-white font-bold text-xs xsm:text-base lg:text-lg">{formatMinutes(focusData.avgDailyTime)}</p>
                <div className={`flex items-center gap-1 ${(percentageChanged(focusData.avgDailyTime, focusData.prevAvgDailyTime)) > 0 ? "text-green-400" : "text-red-500"}`}>
                  <p className="text-xs xsm:text-sm">{percentageChanged(focusData.avgDailyTime, focusData.prevAvgDailyTime)}%</p>
                  <IoIosArrowRoundDown className={`text-base xsm:text-xl ${(percentageChanged(focusData.avgDailyTime, focusData.prevAvgDailyTime)) > 0 ? "rotate-180" : ""}`} />
                </div>
              </div>
              <p className="text-white/30 text-xs lg:text-sm font-semibold">Average Daily Focus</p>
            </div>
          </div>

        </div>

        <div className="flex lg:flex-col gap-4 lg:gap-0 justify-between w-full lg:w-1/4">

          <div className="flex flex-col xxs:flex-row xxs:items-center gap-2 xxs:gap-4 bg-[#343852]/40 px-5 lg:py-2 rounded-xl w-full p-4">
            <FaFire className='size-8 xsm:size-11 rounded-full bg-[#FAD156] p-1 xsm:p-2' />
            <div className="">
              <p className="text-white font-bold text-xs xsm:text-base lg:text-lg">{currentStreak} Days</p>
              <p className="text-white/30 text-xs lg:text-sm font-semibold">current Streak</p>
            </div>
          </div>

          <div className="flex flex-col xxs:flex-row xxs:items-center gap-2 xxs:gap-4 bg-[#343852]/40 px-5 lg:py-2 rounded-xl w-full p-4">
            <BiSolidMedal className='size-8 xsm:size-11 rounded-full bg-[#FAD156] p-0.5 xsm:p-1.5' />
            <div className="">
              <p className="text-white font-bold text-xs xsm:text-base lg:text-lg">{longestStreak} Days</p>
              <p className="text-white/30 text-xs lg:text-sm font-semibold">Longest Streak</p>
            </div>
          </div>

        </div>

      </div>

      <div className=" flex flex-col lg:flex-row min-h-[1300px] xsm:min-h-[1100px] lg:min-h-[500px] flex-1 pb-3 lg:pb-0 gap-5 w-full">

        <div className="lg:w-7/12 h-7/12 xss:h-3/5 xsm:h-full flex flex-col gap-5">

          <div className="h-2/5 xsm:h-3/5 flex flex-col gap-3 bg-[#343852]/40 rounded-xl pt-5 ">
            <p className="text-sm text-white/80 font-Josefin_Sans font-medium px-5">Time Spent in Focus & Pomodoro Sessions</p>
            <div className="flex-1 flex items-center justify-center ">
              <div className="px-2 pb-3 max-w-[600px] max-h-60 2xl:max-h-80 w-full h-full">
                <StackedAreaChart FocusData={{ focusByDays: focusData.focusByDays, promodoroByDays: focusData.promodoroByDays, focusModeByDays: focusData.focusModeByDays }} />
              </div>
            </div>
          </div>
          <div className="h-3/5 xsm:h-2/5 w-full flex flex-col xsm:flex-row gap-5">

            <div className="h-full flex flex-col gap-2 xsm:w-1/2 bg-[#343852]/40 rounded-xl p-5">

              <p className="text-xs xxs:text-sm text-white/80 font-Josefin_Sans font-medium">Category-Wise Task Overview</p>

              <div className="flex-1 flex justify-between">

                <div className="flex-1 flex flex-col gap-1.5 text-xs xxs:text-sm font-medium font-Asap ml-5 justify-center">
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#b15abe]"></div>
                    <p className="text-[#b15abe]">Work</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#59d37a]"></div>
                    <p className="text-[#59d37a]">Study</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#FAD156]"></div>
                    <p className="text-[#FAD156]">Personal</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#b8b7b7]"></div>
                    <p className="text-[#b8b7b7]">Other</p>
                  </div>
                </div>

                <div className="h-full w-3/5">
                  <PieChartCustom pieChartData={{ graphOn: "Category", focusByCategory: taskData?.TaskByCategory }} />
                </div>

              </div>

            </div>

            <div className="h-full xsm:w-1/2 flex flex-col gap-2 bg-[#343852]/40 rounded-xl p-5">
              <p className="text-xs xxs:text-sm text-white/80 font-Josefin_Sans font-medium">Priority-Wise Task Overview</p>

              <div className="flex-1 flex justify-between">

                <div className="flex-1 flex flex-col gap-2 text-xs xxs:text-sm font-medium font-Asap ml-5 justify-center">
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#f14b4b]"></div>
                    <p className="text-[#f14b4b]">high</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#c0ac3a]"></div>
                    <p className="text-[#c0ac3a]">Medium</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="size-2 bg-[#3fbb2e]"></div>
                    <p className="text-[#3fbb2e]">Low</p>
                  </div>
                </div>

                <div className="h-full w-3/5">
                  <PieChartCustom pieChartData={{ graphOn: "Priority", focusByCategory: taskData?.TaskByPriority }} />
                </div>
              </div>
            </div>

          </div>

        </div>

        <div className="lg:flex-1 h-5/12 xss:h-2/5 xsm:h-full flex flex-col gap-5">

          <div className="h-2/5 flex gap-4 bg-[#343852]/40 rounded-xl ">
            <div className="py-6 pl-6 flex flex-col gap-3 w-1/2">
              <p className="text-xs xxs:text-sm text-white/80 font-Josefin_Sans font-medium">Focus Mode Time by Category</p>
              <div className="xs:ml-5 flex-1 flex justify-center items-center">
                <div className="grid grid-cols-2 grid-rows-2 md:grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-5 lg:gap-3 text-xs xxs:text-sm ">
                  <div className="text-[#b15abe]">
                    <p className="font-bold">Work</p>
                    <p className="">{Math.round(((focusData?.focusByCategory?.work) / totalFocusModeTime) * 100) || 0}%</p>
                  </div>
                  <div className="text-[#59d37a] ">
                    <p className="font-bold">Study</p>
                    <p className="">{Math.round(((focusData?.focusByCategory?.study) / totalFocusModeTime) * 100) || 0}%</p>
                  </div>
                  <div className="text-[#FAD156]">
                    <p className="font-bold">Personal</p>
                    <p className="">{Math.round(((focusData?.focusByCategory?.personal) / totalFocusModeTime) * 100) || 0}%</p>
                  </div>
                  <div className="text-[#b8b7b7]">
                    <p className="font-bold">Others</p>
                    <p className="">{Math.round(((focusData?.focusByCategory?.other) / totalFocusModeTime) * 100) || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-1/2 xxs:py-4 lg:py-2">
              <PieChartCustom pieChartData={{ graphOn: "Category", focusByCategory: focusData?.focusByCategory }} />
            </div>
          </div>
          <div className="h-3/5 flex flex-col gap-3 bg-[#343852]/40 rounded-xl pt-5">
            <p className="text-sm text-white/80 font-Josefin_Sans font-medium px-5">Assigned vs Completed Tasks</p>
            <div className="flex-1 flex items-center justify-center">
              <div className="pr-3 pb-3 max-w-[600px] max-h-60 2xl:max-h-80 h-full w-full">
                <StackedBarChart TimeData={{ TaskByDaysRemains: taskData.TaskByDaysRemains, TaskByDaysCompleted: taskData.TaskByDaysCompleted }} />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}

export default analytics
