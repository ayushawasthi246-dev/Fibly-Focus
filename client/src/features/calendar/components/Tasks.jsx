import { useContext, useState } from "react"
import { BsCaretDownFill } from "react-icons/bs";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import assets from "../../../assets/assets";
import { Appcontent } from "../../../context/Appcontext";
import { toast } from "react-toastify";
import axios from "axios";

export default function Tasks({ task, index, fetchtasks }) {

    const { BackendURL, openmodel } = useContext(Appcontent)

    const markcompleted = async (id , projectID , status) => {
        try {
            const res = await axios.post(BackendURL + `/calendar/checkmarked`, { taskid: id , projectid : projectID  , taskstatus : status }, { withCredentials: true })

            if (res.data?.success) {
                await fetchtasks()
                toast.success(res.data.message)
            } else {
                toast.error(res.data?.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    const [selectedtask, setselectedtask] = useState(false)
    
    return (
        <div key={index} className={`bg-[#1E2132] font-Josefin_Sans px-3 py-4 rounded-xl relative ${selectedtask ? "h-56 gap-4" : "h-16 gap-1"} transition-all duration-400 flex flex-col `}>

            <p className={`text-sm text-blue-300 bg-blue-400/30 font-Asap py-1 px-3 w-fit rounded-2xl capitalize ${selectedtask ? "block" : "hidden"} transition-all duration-400`}>{task.Status}</p>

            <p className="text-xs text-white/70 truncate h-fit pr-16">{task.Project}</p>
            <p className="text-base font-semibold text-white truncate h-fit pr-16">{task.Heading}</p>

            <div className={`flex gap-5 ${selectedtask ? "block" : "hidden"} transition-all duration-400`}>
                <p className="text-xs text-white bg-gray-400/30 py-1.5 px-3 w-fit rounded-2xl">{task.Category}</p>
                {
                    task.Priority === 'high' ?
                        <div className="bg-red-800/40 w-fit flex items-baseline gap-1 py-1.5 px-3 rounded-3xl">
                            <img src={assets.high} alt={task.Priority} className="h-2.5" />
                            <span className=" text-xs font-semibold text-[#ff3838]">High</span>
                        </div>
                        :
                        task.Priority === 'medium' ?
                            <div className="bg-[#8a791d]/50 w-fit flex items-baseline gap-1 py-1.5 px-3 rounded-3xl">
                                <img src={assets.medium} alt="medium" className="h-2.5" />
                                <span className=" text-xs font-semibold text-[#ffd900]">Medium</span>
                            </div>
                            :
                            task.Priority === 'low' ?
                                <div className="bg-[#3fbb2e]/40 w-fit flex items-baseline gap-1 py-1.5 px-3 rounded-3xl">
                                    <img src={assets.low} alt="Low" className="h-2.5" />
                                    <span className=" text-xs font-semibold text-[#81f172]">Low</span>
                                </div>
                                :
                                null
                }
            </div>
            <div className={`flex justify-between items-center bg-[#323544] absolute bottom-0 right-0 left-0 px-3 py-2 rounded-b-2xl ${selectedtask ? "block" : "hidden"} transition-all duration-400`}>
                <div className="flex gap-3">
                    <MdModeEdit
                        onClick={() => openmodel("edit", task)}
                        className="text-white cursor-pointer rounded hover:bg-gray-400/30 h-6 w-6 p-1" />
                    <RiDeleteBin6Fill
                        onClick={() => openmodel("delete", { TaskID: task.Taskid, TaskHeading: task.Heading })}
                        className="text-[#ee3333] cursor-pointer rounded hover:bg-[#b62b2b]/30 h-6 w-6 p-1" />
                </div>
                <button
                    onClick={() => markcompleted(task.Taskid , task.projectID , task.Status)}
                    className="text-xs font-semibold font-Exo_2 text-white/70 py-1.5 px-3 hover:bg-gray-400/10 hover:text-white cursor-pointer rounded-lg">Mark completed</button>
            </div>
            <BsCaretDownFill
                onClick={() => setselectedtask(prev => !prev)}
                className={`absolute right-5 top-3 cursor-pointer text-white text-lg hover:scale-110 transition-all duration-200 ${selectedtask ? "rotate-180" : "rotate-0"} transition-all duration-300`} />
        </div>
    )
}