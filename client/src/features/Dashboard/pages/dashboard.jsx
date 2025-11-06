import axios from 'axios'
import assets from '../../../assets/assets'
import { toast } from 'react-toastify'
import { useContext, useState, useEffect, useRef } from 'react'
import { Appcontent } from '../../../context/Appcontext'
import { TiPin } from "react-icons/ti";
import { RiUnpinFill } from "react-icons/ri";
import { FaArrowLeftLong } from "react-icons/fa6"
import { useNavigate } from "react-router-dom"
import PieChartTasks from "../components/dashboardpiechart.jsx"

const dashboard = () => {
    const { BackendURL, userdata, Streak , statuscheck} = useContext(Appcontent)
    const navigate = useNavigate()

    const [belowXSM, setbelowXSM] = useState(window.innerWidth <= 550);

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
        const handleResize = () => setbelowXSM(window.innerWidth <= 550);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [authChecked, isLogged]);

    useEffect(() => {
        if (!authChecked || !isLogged) return
        const handleResize = () => setbelowXSM(window.innerWidth <= 550);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [authChecked, isLogged]);

    const [showtasks, setshowtasks] = useState(false)

    const [Tasks, setTasks] = useState([])
    const [AllProjects, setAllProjects] = useState([])
    const [TotalTask, setTotalTask] = useState(0)
    const [TaskcompletionRate, setTaskcompletionRate] = useState(0)
    const [ToDoTasks, setToDoTasks] = useState(0)
    const [InProgressTasks, setInProgressTasks] = useState(0)
    const [completedTasks, setcompletedTasks] = useState(0)

    const today = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`

    const fetchtasks = async () => {
        try {
            const res = await axios.post(BackendURL + '/promodoro/todaytask', { today }, { withCredentials: true })
            if (res.data?.success) {
                setTasks(res.data.TasksData)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const projects = async () => {
        try {
            const res = await axios.get(BackendURL + '/dashboard/projectsData', { withCredentials: true })
            if (res.data?.success) {
                setAllProjects(res.data.ProjectData)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const stats = async () => {
        try {
            const res = await axios.get(BackendURL + '/dashboard/statsData', { withCredentials: true })
            if (res.data?.success) {
                setTotalTask(res.data.totaltasks)
                setToDoTasks(res.data.todotasks)
                setInProgressTasks(res.data.inprogrestasks)
                setcompletedTasks(res.data.completedtasks)
                setTaskcompletionRate(res.data.completedtasksRate)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const pinTheProject = async (ID) => {
        try {
            const res = await axios.post(BackendURL + '/dashboard/pinproject', { projectID: ID }, { withCredentials: true })
            if (res.data?.success) {
                projects()
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        if (!authChecked || !isLogged) return
        fetchtasks()
        projects()
        stats()
        Streak()
    }, [authChecked, isLogged])


    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const formatDateKey = (year, month, date) => {
        const correctFormat = `${String(date).padStart(2, "0")} ${months[month]} ${year} `
        return correctFormat
    }
    const [selecteddate, setselecteddate] = useState(formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()))

    return (
        <div className="flex-1 flex relative overflow-x-hidden">

            <div className="min-h-[950px] xsm:min-h-[1050px] xlg:min-h-[700px] max-h-[900px] w-full mt-3 flex flex-col gap-3 ">

                <p className="text-white/70 ml-12 xs:ml-14 sm:ml-18 md:ml-0 -translate-y-3.5 xxs:-translate-y-1.5 xs:-translate-y-2.5 sm:-translate-y-1.5 md:-translate-y-0 text-xs xs:text-base sm:text-xl absolute">Today , <br className='xxs:hidden'/>{selecteddate}</p>

                <div className="min-h-40 xs:min-h-52 xsm:min-h-60 xlg:h-2/6 xsm:mr-10 pb-3 relative flex items-end">
                    <img src={assets.Dash} alt="Mascot" className="max-h-80 h-full absolute right-4 xs:right-8 xsm:right-12 py-3" />
                    <div className="bg-[#272a3d] h-3/4 w-full rounded-2xl flex flex-col justify-center gap-3 pl-6 xsm:pl-10">
                        <p className="text-white text-xl xs:text-2xl xsm:text-3xl font-bold font-Exo_2">{`Hi , ${userdata.Username}`}</p>
                        <p className="text-white/50 w-1/2 text-xs xs:text-sm xsm:text-base font-semibold font-Josefin_Sans">Your focus streak is waiting to grow  !</p>
                    </div>
                </div>


                <div className="xlg:flex-1 flex flex-col xlg:flex-row gap-7 xsm:mr-10">


                    <div className=" xlg:max-w-7/12 flex flex-col gap-4 flex-1 h-full w-full ">

                        <p className="text-white text-xl font-bold pb-2">Ongoing Projects</p>
                        <div className="flex flex-col justify-between h-full w-full gap-7 xlg:gap-5">
                            {[0, 1, 2].map(i => (
                                <>
                                    {
                                        AllProjects[i] ? (
                                            <div
                                                onClick={() => navigate(`/kanban/${AllProjects[i].ProjectID}`)}
                                                key={i}
                                                className="bg-[#272a3d] hover:bg-[#31354d] flex-1 w-full p-4 xs:p-5 flex flex-col justify-between gap-3 rounded-2xl relative cursor-pointer">
                                                {AllProjects[i].isPin ?

                                                    (<RiUnpinFill
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            pinTheProject(AllProjects[i].ProjectID)
                                                        }}
                                                        className="text-white size-4 xs:size-6 absolute right-5 cursor-pointer hover:scale-110" />)
                                                    :
                                                    (<TiPin
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            pinTheProject(AllProjects[i].ProjectID)
                                                        }}
                                                        className="text-white size-4 xs:size-6 absolute right-5 cursor-pointer hover:scale-110" />)

                                                }

                                                <p className="text-sm xs:text-base text-white font-bold w-1/2 font-Lexend line-clamp-2 truncate">{AllProjects[i].Heading}</p>
                                                <div className="flex flex-col gap-4">
                                                    <p className="text-xs text-white/60 xs:text-white font-medium ">{`${AllProjects[i].numOfTask} tasks  |  ${AllProjects[i].complianceRate}% `}</p>
                                                    <div className="bg-black h-2 xs:h-2.5 w-full rounded-full flex items-center">
                                                        <div
                                                            style={{ width: `${AllProjects[i].complianceRate}%` }}
                                                            className="bg-[#871399] h-1 rounded-full mx-1"></div>
                                                    </div>
                                                </div>
                                            </div>)
                                            :
                                            (<div key={i} className="bg-white/25 h-29 p-5 flex flex-col gap-4 rounded-2xl relative"></div>)
                                    }
                                </>
                            ))}
                        </div>

                    </div>


                    <div className="w-full xlg:flex-1 flex gap-4 flex-col">

                        <p className="text-white text-xl font-bold pb-2 ">Statistics</p>

                        <div className="bg-[#272a3d] h-80 xs:h-60 xsm:h-72 xlg:flex-1 flex flex-col xs:flex-row xlg:flex-col items-center gap-5 w-full rounded-2xl py-5 xs:py-0">

                            <div className="relative w-full xs:w-1/2 xlg:w-full h-full xlg:flex-1 ">

                                <PieChartTasks  ToDoTasks={ToDoTasks}  InProgressTasks = {InProgressTasks} completedTasks ={completedTasks} belowXSM ={belowXSM} />

                            </div>

                            <div className="xlg:h-3/12 flex xs:flex-col xs:justify-center xlg:justify-start xs:items-start xlg:items-center gap-6 xs:gap-3">
                                <div className="flex flex-col xs:flex-row gap-5 justify-center items-center text-white/90 text-sm xsm:text-lg font-semibold font-Josefin_Sans">
                                    <p>Total Tasks :</p>
                                    <p>{TotalTask}</p>
                                </div>
                                <div className="flex flex-col xs:flex-row  gap-5 justify-center items-center text-white/90 text-sm xsm:text-lg font-semibold font-Josefin_Sans">
                                    <p>Completion Rate :</p>
                                    <p>{`${TaskcompletionRate} %`}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            <div className={`min-h-[1100px] xlg:min-h-[710px] h-full ${showtasks ? "w-65" : "w-0"} xxl:min-w-36 xxl:w-96 py-4 pl-8 border-l-2 border-white/40 absolute xxl:relative transition-all duration-400 translate-x-3 xxl:translate-x-0 right-0 bg-[#080414] hidden xsm:flex gap-8 flex-col`}>

                <FaArrowLeftLong
                    onClick={() => setshowtasks(!showtasks)}
                    className={`text-white text-4xl bg-[#080414] p-2 border-[2px] border-white/40 rounded-full absolute top-3 -left-5 cursor-pointer hover:border-white hover:scale-110 transition-all duration-200 ${showtasks ? "rotate-180" : "rotate-0"} xxl:hidden`} />

                <p className={`text-2xl font-bold font-Josefin_Sans text-white ${showtasks ? "flex" : "hidden xxl:flex"}`}>Today Tasks</p>

                <div className={`flex-1 ${Tasks.length > 0 ? "" : "justify-center items-center"} ${showtasks ? "flex" : "hidden xxl:flex"} flex-col gap-8 transition-all duration-300 overflow-y-auto`}>

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
        </div>
    )
}

export default dashboard
