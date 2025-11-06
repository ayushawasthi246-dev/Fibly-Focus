import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { Appcontent } from '../context/Appcontext'
import { NavLink, useNavigate } from "react-router-dom"
import { motion } from 'motion/react'
import Tooltip from './tooltip'

import { TbLayoutSidebarRightFilled } from "react-icons/tb";
import { FaHome } from "react-icons/fa";
import { IoCalendarSharp } from "react-icons/io5";
import { RiPieChartFill } from "react-icons/ri";
import { PiKanbanFill } from "react-icons/pi";
import { RxLapTimer } from "react-icons/rx";
import { GoGoal } from "react-icons/go";

import { TbLogout } from "react-icons/tb";
import axios from 'axios'
import { toast } from 'react-toastify'

const sidebar = ({ fit, setfit }) => {

    const { userdata , BackendURL ,setisloggedin ,setuserdata  } = useContext(Appcontent)

    const [expand, setexpand] = useState(window.innerWidth >= 1170);

    useEffect(() => {
        const handleResize = () => setexpand(window.innerWidth >= 1170);

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const [show, setshow] = useState(false)
    const sidebarRef = useRef(null)
    const toggleRef = useRef(null)

    const navItems = [
        { name: "Dashboard", path: "/Dashboard", icon: FaHome },
        { name: "Calendar View", path: "/calendar", icon: IoCalendarSharp },
        { name: "Analytics", path: "/Analytics", icon: RiPieChartFill },
        { name: "Kanban board", path: "/Kanban", icon: PiKanbanFill },
        { name: "Pomodoro timer", path: "/Pomodoro-timer", icon: RxLapTimer },
        { name: "Focus mode", path: "/Focus-mode", icon: GoGoal },
    ];

    const showsidebar = () => {
        setexpand(!expand)
        setshow(!show)
        setfit(!fit)
    }

    const navigate = useNavigate()
    
    const logout = async ()=>{

        try {
            const {data} = await axios.post(BackendURL + '/auth/logout' ,{} , {
                withCredentials: true,
            })
            data.success && setisloggedin(false)
            data.success && setuserdata(false)
            navigate('/')
            toast.success(data.message)
        } catch (error) {
            toast.error(error.message)
        }

    }


    useEffect(() => {

        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !toggleRef.current.contains(event.target)) {
                showsidebar()
            }
        };

        if (expand) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [expand]);


    return (
        <>
            <div
                ref={toggleRef}
                className="absolute md:hidden top-4 xs:top-6 z-20 bg-[#080414] rounded-2xl ">
                <motion.button
                    onTap={() => showsidebar()}
                    whileHover={{ backgroundColor: "#ffffff2e" }}
                    className="flex lg:hidden flex-col justify-center items-start gap-1.5 sm:gap-2 p-3 rounded-full overflow-hidden">
                    <motion.div
                        animate={show ? "cross" : "lines"}
                        variants={{
                            lines: {
                                rotate: 0
                            },
                            cross: {
                                y: 9,
                                rotate: 45
                            }
                        }}
                        className="h-[1px] xsm:h-0.5 w-6 sm:w-8 bg-white"></motion.div>
                    <motion.div
                        animate={show ? "cross" : "lines"}
                        variants={{
                            lines: {
                                rotate: 0
                            },
                            cross: {
                                rotate: -45
                            }
                        }}
                        className="h-[1px] xsm:h-0.5 w-6 sm:w-8 bg-white"></motion.div>
                    <motion.div
                        animate={show ? "cross" : "lines"}
                        variants={{
                            lines: {
                                x: 0,
                                opacity: 1
                            },
                            cross: {
                                x: -10,
                                opacity: 0
                            }
                        }}
                        className="h-[1px] xsm:h-0.5 w-3 sm:w-4 bg-white"></motion.div>
                </motion.button>
            </div>
            <div
                ref={sidebarRef}
                className={`h-full ${expand ? "w-40 xs:w-50 sm:w-60" : "w-20"} border-r-2 border-white/20 transition-all duration-200 ${show ? "-translate-x-0" : "-translate-x-96"} md:-translate-x-0 bg-[#080414] overflow-x-hidden`}>

                <div className="pr-5 flex min-h-full flex-col gap-10 bg-[#080414]">

                    <div className={`flex ${expand ? "justify-end md:justify-between items-baseline" : "justify-center mt-2"} relative group `}>
                        <div className={`text-lg xs:text-xl sm:text-[26px] md:text-3xl xs:mr-4 mt-1 font-semibold ${!expand && "hidden"}`}>
                            <span className="text-[#FAD156]">Fibly</span>
                            <span className="text-white">Focus</span>
                        </div>
                        <img src={assets.logo} alt="" className={`h-12 md:${expand && "hidden"} hover:hidden hidden md:block absolute top-0 z-10 opacity-100 pointer-events-none group-hover:opacity-0`} />
                        <TbLayoutSidebarRightFilled
                            onClick={() => setexpand(!expand)}
                            className={`text-white ${expand ? "text-2xl" : "scale-x-[-1] mt-3 opacity-0 group-hover:opacity-100 text-3xl"} hidden md:block cursor-pointer `} />
                    </div>

                    <div className={`flex flex-col justify-center items-center ${!expand && "hidden"}`}>
                        <p className="flex justify-center items-center text-2xl xs:text-3xl sm:text-4xl font-Bungee bg-white/60 size-18 xs:size-20 sm:size-24 rounded-full mb-1.5 xs:mb-3" >{userdata?.Username.slice(0, 2)}</p>
                        <p className="text-white text-xs xs:text-sm sm:text-base font-medium mb-0.5">{userdata?.Username}</p>
                        <p className="text-white/60 text-[8px] xs:text-[10px] xsm:text-xs">{userdata?.Email}</p>
                    </div>

                    <div className="flex flex-col gap-2 mb-8">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => { setexpand(false), setshow(!show), setfit(!fit) }}
                                    className={({ isActive }) => [
                                        `flex items-center ${expand ? "justify-start" : "justify-center"} gap-5 py-2 px-2 hover:bg-[#262c46]`,
                                        isActive
                                            ? "bg-[#262c46]/80"
                                            : ""
                                    ].join(" ")
                                    }>
                                    {!expand ? (
                                        <Tooltip text={item.name}>
                                            <Icon className="text-white text-2xl" />
                                        </Tooltip>
                                    ) : (
                                        <Icon className="text-white text-sm xs:text-base sm:text-xl" />
                                    )}
                                    <span className={`text-white text-xs xs:text-sm sm:text-lg font-semibold font-Asap ${!expand && "hidden"}`}>{item.name}</span>
                                </NavLink>
                            )
                        })}
                    </div>

                    <div onClick={logout} className={`flex mt-auto items-center ${expand ? "justify-start" : "justify-center"} gap-5 py-2 px-2 hover:bg-[#262c46] cursor-pointer`}>
                        <Tooltip text={"Log out"}>
                            <TbLogout className={`text-white ${!expand ? "text-2xl" : "text-sm xs:text-base sm:text-xl"}`} />
                        </Tooltip>
                        <p className={`text-white text-xs xs:text-sm sm:text-lg font-semibold font-Asap ${!expand && "hidden"}`}>Log out</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default sidebar
