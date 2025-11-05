import { useContext, useEffect, useState } from "react"
import { useScroll, motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Appcontent } from "../context/Appcontext"
import axios from "axios"
import { toast } from "react-toastify"

export default function Navbar() {
    
    const { isloggedin, userdata , BackendURL ,setisloggedin ,setuserdata } = useContext(Appcontent)
    
    const { scrollY } = useScroll()
    const [scrollingstarted, setscrollingstarted] = useState(false)
    const [menu, setmenu] = useState(false)
    
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

    const navigate = useNavigate()

    useEffect(() => {
        const remove = scrollY.onChange((Y) => {
            if (Y > 0 && !(scrollingstarted)) {
                setscrollingstarted(true)
            } else if (Y == 0 && scrollingstarted) {
                setscrollingstarted(false)
            }
        })
        return () => remove()
    }, [scrollY, scrollingstarted])

    return (
        <div className={`sticky top-0 w-screen z-20 bg-[#080414] border-white/50 ${scrollingstarted ? "border-b-1" : ""} `}>
            <div className="py-3 sm:py-8 px-8 xl:px-15 flex justify-between items-center top-0 text-2xl sm:text-3xl xl:text-4xl font-bold font-roboto">
                <div >
                    <span className="text-[#FAD156]">Fibly</span>
                    <span className="text-white">Focus</span>
                </div>
                <nav className="hidden lg:flex gap-8 items-end pt-3 text-lg xl:text-xl">
                    <a href="#" className="text-white/80 cursor-pointer transition-all duration-200 hover:text-white flex flex-col gap-2 overflow-hidden group">
                        <span >Home</span>
                        <span className="bg-amber-300 h-0.5 w-full transition-all duration-400 -translate-x-[200%] group-hover:translate-x-0"></span>
                    </a>
                    <a href="#" className="text-white/80 cursor-pointer transition-all duration-200 hover:text-white flex flex-col gap-2 overflow-hidden group">
                        <span >About Us</span>
                        <span className="bg-amber-300 h-0.5 w-full transition-all duration-400 -translate-x-[200%] group-hover:translate-x-0"></span>
                    </a>
                    <a href="#" className="text-white/80 cursor-pointer transition-all duration-200 hover:text-white flex flex-col gap-2 overflow-hidden group">
                        <span >Features</span>
                        <span className="bg-amber-300 h-0.5 w-full transition-all duration-400 -translate-x-[200%] group-hover:translate-x-0"></span>
                    </a>
                </nav>
                {isloggedin ?
                    <div className="hidden lg:flex gap-5 xl:gap-7">

                        <button onClick={logout} className="relative bg-[#080414] text-white/80 text-sm xl:text-base font-bold h-12 w-27 xl:w-32 rounded-3xl cursor-pointer m-[2px] transition-all duration-200 border-[2px] hover:border-[3px] hover:text-lg hover:text-white active:scale-95">LOG OUT </button>

                        <button className="relative bg-[#080414] text-white text-sm xl:text-base font-bold h-12 w-12 rounded-3xl m-[2px] transition-all duration-200 border-[2px] uppercase">{userdata ? userdata.Username[0] : "N"}</button>
                    </div>
                    : 
                    <div className="hidden lg:flex gap-5 xl:gap-7">

                        <button onClick={() => { navigate('/login') }} className="relative bg-[#080414] text-white/80 text-sm xl:text-base font-bold h-12 w-27 xl:w-32 rounded-3xl cursor-pointer m-[2px] transition-all duration-200 border-[2px] hover:border-[3px] hover:text-lg hover:text-white active:scale-95">LOG IN</button>

                        <button onClick={() => { navigate('/singup') }} className="relative bg-[#080414] text-white/80 text-sm xl:text-base font-bold h-12 w-27 xl:w-32 rounded-3xl cursor-pointer m-[2px] transition-all duration-200 border-[2px] hover:border-[3px] hover:text-lg hover:text-white active:scale-95">SING UP</button>

                    </div>
                }
                <motion.button
                    onTap={() => { setmenu(!menu) }}
                    whileHover={{ backgroundColor: "#ffffff2e" }}
                    className="flex lg:hidden flex-col justify-center items-end gap-1.5 sm:gap-2 p-3 rounded-full overflow-hidden">
                    <motion.div
                        animate={menu ? "cross" : "lines"}
                        variants={{
                            lines: {
                                rotate: 0
                            },
                            cross: {
                                y: 10,
                                rotate: 45
                            }
                        }}
                        className=" h-0.5 w-6 sm:w-8 bg-white"></motion.div>
                    <motion.div
                        animate={menu ? "cross" : "lines"}
                        variants={{
                            lines: {
                                rotate: 0
                            },
                            cross: {
                                rotate: -45
                            }
                        }}
                        className=" h-0.5 w-6 sm:w-8 bg-white"></motion.div>
                    <motion.div
                        animate={menu ? "cross" : "lines"}
                        variants={{
                            lines: {
                                x: 0,
                                opacity: 1
                            },
                            cross: {
                                x: 10,
                                opacity: 0
                            }
                        }}
                        className=" h-0.5 w-3 sm:w-4 bg-white"></motion.div>
                </motion.button>
            </div>
            <motion.div
                animate={menu ? "show" : "hide"}
                variants={{
                    show: {
                        opacity: 1,
                        height: "auto"
                    },
                    hide: {
                        opacity: 0,
                        height: "50px"
                    }
                }}
                style={{
                    display: menu ? "flex" : "none"
                }}
                className="absolute flex flex-col w-full bg-[#080414] overflow-hidden divide-y px-8 pb-2 divide-white/20 shadow-[0_10px_40px_-20px_rgba(255,255,255,0.15)] sm:shadow-[0_20px_50px_-20px_rgba(255,255,255,0.15)]">
                <a href="#" className="w-full font-Asap text-green-50 cursor-pointer py-4 ">Home</a>
                <a href="#" className="w-full font-Asap text-green-50 cursor-pointer py-4">About Us</a>
                <a href="#" className="w-full font-Asap text-green-50 cursor-pointer py-4">Features</a>
                <a onClick={() => { navigate('/singup') }} className="w-full font-Asap text-green-50 cursor-pointer py-4">Sing Up</a>
            </motion.div>
        </div>
    )
}
