import { useContext, useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6"
import { FaCaretDown } from "react-icons/fa";
import { Appcontent } from "../../../context/Appcontext";
import SliderWithTooltip from "../components/silder";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import { toast } from "react-toastify";

const Focus_mode = () => {

    const [showtasks, setshowtasks] = useState(false)
    const [period, setperiod] = useState("week")
    const [history, sethistory] = useState([])
    const { BackendURL, statuscheck, Streak } = useContext(Appcontent)

    const navigate = useNavigate()

    const fetchsessions = async () => {
        try {
            const res = await axios.post(BackendURL + '/focusMode/sessionHistory', { period }, { withCredentials: true })
            if (res.data?.success) {
                sethistory(res.data.History)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
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
        fetchsessions()
        Streak()
    }, [period, authChecked, isLogged])

    const [Title, seTtitle] = useState("");
    const [Category, setCategory] = useState("study");
    const [SessionsDuration, setSessionsDuration] = useState(0);
    const [BreakDuration, setBreakDuration] = useState(0);
    const [NumberOfCycles, setNumberOfCycles] = useState(0);

    const createSession = async () => {
        try {
            const res = await axios.post(BackendURL + '/focusMode/createSession', { Title, Category, SessionsDuration, BreakDuration, cycles: NumberOfCycles }, { withCredentials: true })
            if (res.data?.success) {
                const sessionID = res.data.ID
                navigate(`/Focus-mode/${sessionID}`)
            } else {
                toast.error(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }


    return (
        <div className="flex-1 flex relative overflow-x-hidden">

            <div   
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  createSession()
                }
              }}
              tabIndex={0}
            className="min-h-[600px] sm:min-h-[650px] flex-1 flex flex-col gap-4 sm:gap-5 py-2 pr-2 xsm:pr-14 xxl:pr-8 pl-2">

                <p className="xxs:text-lg sm:text-xl md:text-3xl font-bold -mt-1 md:mt-2 text-white font-Josefin_Sans pl-12 sm:pl-15 md:pl-0">Create Focus Session</p>

                <div className="flex flex-col gap-6">
                    <div className="text-white flex flex-col gap-2">
                        <label className="text-xs sm:text-sm font-semibold font-Asap">Title : </label>
                        <input
                            type="text"
                            value={Title}
                            onChange={(e) => seTtitle(e.target.value)}
                            placeholder="Enter the session title"
                            className="focus:outline-none transition-all duration-100 focus:border-[#B13BC3]  border-white/60 border-2 rounded-lg text-xs sm:text-sm py-2 px-2 sm:px-3" name="" id="" />
                    </div>
                    <div className="text-white flex flex-col gap-2 relative">
                        <label className="text-xs sm:text-sm font-semibold font-Asap">Category : </label>
                        <select
                            value={Category}
                            onChange={(e) => setCategory(e.target.value)}
                            className='border-2 border-white/60 rounded-lg appearance-none w-full text-xs sm:text-sm py-2 px-2 sm:px-3 text-white focus:outline-none transition-all duration-100 focus:border-[#B13BC3] bg-[#080414] '>
                            <option value="study">study</option>
                            <option value="work">work</option>
                            <option value="personal">personal</option>
                            <option value="other">other</option>
                        </select>
                        <FaCaretDown className="text-sm xxs:text-lg sm:text-2xl text-white/60 z-20 absolute top-9 right-2.5 pointer-events-none" />
                    </div>
                    <div className="text-white flex flex-col gap-2">
                        <label className="text-xs sm:text-sm font-semibold font-Asap">Sessions Duration :</label>
                        <SliderWithTooltip value={SessionsDuration} setValue={setSessionsDuration} min={0} max={240} />
                    </div>
                    <div className="text-white flex flex-col gap-2">
                        <label className="text-xs sm:text-sm font-semibold font-Asap">Break Duration :</label>
                        <SliderWithTooltip value={BreakDuration} setValue={setBreakDuration} min={0} max={120} />
                    </div>
                    <div className="text-white flex flex-col gap-2">
                        <label className="text-xs sm:text-sm font-semibold font-Asap">Number of cycles :</label>
                        <SliderWithTooltip value={NumberOfCycles} setValue={setNumberOfCycles} min={0} max={10} />
                    </div>
                </div>

                <button
                    onClick={() => createSession()}
                    className="text-white font-Josefin_Sans font-semibold text-sm xxs:text-base md:text-xl bg-white/10 w-fit px-7 md:px-10 py-3 my-2 self-center rounded-2xl hover:bg-white/20 cursor-pointer transition-all duration-200 hover:scale-105">Create the Session</button>

            </div>

            <div className={`${showtasks ? "w-72" : "w-1"} min-h-[600px] sm:min-h-[650px] h-full translate-x-2 py-4 pl-8 border-l-2 border-white/40 absolute xxl:relative transition-all duration-400 right-0 bg-[#080414] hidden xsm:block z-20`}>
                <FaArrowLeftLong
                    onClick={() => setshowtasks(!showtasks)}
                    className={`text-white text-4xl bg-[#080414] p-2 border-[2px] border-white/40 rounded-full absolute top-3 -left-5 cursor-pointer hover:border-white hover:scale-110 transition-all duration-200 ${showtasks ? "rotate-180" : "rotate-0"} `} />

                <div className={`flex flex-col h-full gap-8 ${showtasks ? "block" : "hidden"} transition-all duration-300`}>
                    <div className="flex justify-between">
                        <p className="text-xl font-bold font-Josefin_Sans text-white">History</p>
                        <div className="bg-white/70 px-2 mr-4 py-0.5 rounded-2xl">
                            <select
                                className="text-[#080414] font-semibold font-Asap text-sm px-2 cursor-pointer"
                                name="period"
                                value={period}
                                onChange={(e) => setperiod(e.target.value)}
                                id="">
                                <option value="week">Week</option>
                                <option value="month">Month</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-8 mr-2 overflow-y-auto 
                    scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg scrollbar-hover:scrollbar-thumb-gray-500">
                        {history.length > 0 ? (
                            history.map((session, i) => (
                                <div
                                    onClick={() => {
                                        seTtitle(session.Title)
                                        setCategory(session.SessionCategory)
                                        setSessionsDuration(session.SessionDuration)
                                        setBreakDuration(session.BreakDuration)
                                        setNumberOfCycles(session.cycles)
                                    }}
                                    className={`border-l-3 ${session.Completed ? "border-green-600" : "border-red-400"} px-3 py-2 flex flex-col gap-3 cursor-pointer hover:bg-white/10 rounded-r-2xl`}>
                                    <p className="text-base text-white/80 mb-1 truncate capitalize">{session.Title}</p>
                                    <div className="flex justify-between pr-2  text-white">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-light ">Session</p>
                                            {session.SessionDuration > 60 ?
                                                <p className="text-white/70 text-xs font-semibold">
                                                    {String(Math.floor(session.SessionDuration / 60)).padStart(2, "0")} h : {String(session.SessionDuration % 60).padStart(2, "0")} min
                                                </p>
                                                :
                                                <p className="text-white/70 text-xs font-semibold">
                                                    {String(session.SessionDuration % 60).padStart(2, "0")} min
                                                </p>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className=" text-xs font-light ">Break</p>
                                            {session.BreakDuration > 60 ?
                                                <p className="text-white/70 text-xs font-semibold">
                                                    {String(Math.floor(session.BreakDuration / 60)).padStart(2, "0")} h : {String(session.BreakDuration % 60).padStart(2, "0")} min
                                                </p>
                                                :
                                                <p className="text-white/70 text-xs font-semibold">
                                                    {String(session.BreakDuration % 60).padStart(2, "0")} min
                                                </p>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <p className="text-xs font-light ">cycles</p>
                                            <p className="text-white/70 text-xs font-semibold">{session.cycles}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-white text-2xl">.....</div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Focus_mode
