import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Appcontent } from '../../../context/Appcontext.jsx';
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md"
import { useNavigate } from 'react-router-dom'
import assets from '../../../assets/assets.jsx';

const KanbanPage = () => {

    const { BackendURL, statuscheck, Streak } = useContext(Appcontent)

    const presetColors = ["#3B82F6  ", "#06B6D4", "#0eb44d", "#9333EA", "#EC4899"]
    const [customcolor, setcustomcolor] = useState("#ffffff")
    const [color, setColor] = useState(presetColors[0])
    const [name, setname] = useState("")
    const [mode, setmode] = useState("")
    const [ProjectID, setProjectID] = useState("")

    const [card, setcard] = useState(false)
    const [projectlist, setprojectlist] = useState([])

    const navigate = useNavigate()

    const handleUpdate = (project) => {
        setmode("Update")
        setname(project.Heading)
        setColor(project.Color)
        setProjectID(project.ProjectID)
        setcard(true)
    }
    const handledelete = (project) => {
        setmode("delete")
        setname(project.Heading)
        setProjectID(project.ProjectID)
    }

    const handleclose = () => {
        setmode("")
        setname("")
        setColor("")
        setProjectID("")
        setcard(false)
    }

    const fetchProjects = async () => {
        try {
            const res = await axios.get(BackendURL + `/kanban/projectlist`, { withCredentials: true })
            if (res.data?.success) {
                setprojectlist(res.data.ProjectData)
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong")
        }
    }

    const submit = async () => {
        try {
            let res

            if (mode === "create") {
                res = await axios.post(BackendURL + "/kanban/createproject", { Heading: name, Color: color }, { withCredentials: true })
            } else if (mode === "Update") {
                res = await axios.post(BackendURL + "/kanban/editproject", { Heading: name, Color: color, id: ProjectID }, { withCredentials: true })
            } else {
                res = await axios.delete(BackendURL + "/kanban/deleteproject", {
                    data: { id: ProjectID },
                    withCredentials: true
                })
            }

            if (res.data?.success) {
                handleclose()
                await fetchProjects()
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong")
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
        if (!authChecked || !isLogged) return;
        fetchProjects()
        Streak()
    }, [authChecked, isLogged, authChecked, isLogged]);


    return (
        <>
            <div className="min-h-[620px] h-full w-full flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <span className="text-sm xxs:text-lg sm:text-2xl ml-14 sm:ml-20 md:ml-0 font-semibold text-white font-Lexend">All Projects</span>
                    <button
                        onClick={() => {
                            setcard(true)
                            setmode("create")
                        }}
                        className="bg-white px-2.5 xxs:px-4 sm:px-5 py-1.5 xxs:py-2.5 rounded-lg font-bold text-[10px] xxs:text-xs sm:text-sm cursor-pointer transition-all duration-250 hover:bg-gray-100 hover:scale-110">Create Project</button>
                </div>

                <div className={`flex-1 mb-3 p-5 rounded-xl flex flex-col gap-6 w-full bg-[#1E2132] ${projectlist.length === 0 ? "justify-center items-center" : ""} overflow-auto relative`}>
                    <div className={`h-full w-full absolute transition-all duration-200 z-10 top-0 left-0 bg-white/13 flex justify-center items-center  ${card ? "block" : "hidden"} overflow-auto`}>
                        {/* add project */}
                        <div
                            onKeyDown={(e) => {
                                if (e.key == "Enter") {
                                    submit()
                                }
                            }}
                            tabIndex={0}
                            className="mx-6 xsm:mx-12 lg:mx-0 w-full lg:w-1/2 flex flex-col bg-[#26232e] text-white rounded-2xl p-8 ">
                            <p className="text-lg sm:text-2xl text-white font-bold font-Exo_2 mb-1.5">{mode === "create" ? "Add Project" : "Edit Your project"}</p>
                            <p className="text-xs sm:text-sm font-semibold text-white/60 mb-7">Give your project a name and pick a color to make it stand out</p>

                            <div className="flex flex-col gap-6">
                                <div className="">
                                    <label className="block text-xs sm:text-sm font-Josefin_Sans font-semibold mb-3 ">Project name</label>
                                    <input
                                        placeholder="Enter your Project name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setname(e.target.value)}
                                        maxLength={50}
                                        className='border-2 border-white/30 rounded-lg px-3 py-2 w-full text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2' />
                                </div>

                                <div className="">
                                    <label className="flex gap-2 text-xs sm:text-sm font-Josefin_Sans font-semibold mb-3">
                                        <p className="">Pick a color</p>
                                        <p className="text-white/50">(option)</p>
                                    </label>
                                    <div className="flex gap-5">
                                        {presetColors.map((c) => (
                                            <div
                                                key={c}
                                                onClick={() => setColor(c)}
                                                style={{ backgroundColor: c }}
                                                className={`size-4 sm:size-5 rounded-full hover:border-2 cursor-pointer active:border-[3px] border-white ${color === c ? "border-[3px]" : ""}`} ></div>
                                        ))}

                                        <div
                                            style={{ backgroundColor: customcolor }}
                                            className={`size-4 sm:size-5 relative rounded-full hover:border-2 cursor-pointer active:border-[3px] border-white ${color === customcolor ? "border-[3px]" : ""}`}>
                                            <input
                                                type="color"
                                                value={customcolor}
                                                id="CustomColor"
                                                onChange={(e) => {
                                                    setcustomcolor(e.target.value)
                                                    setColor(e.target.value)
                                                }}
                                                className='h-full w-full absolute opacity-0 cursor-pointer' />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="pt-5 mt-8 flex justify-end gap-6 border-t-2 border-white/30">
                                <button type='button'
                                    onClick={() => { handleclose() }}
                                    className="text-xs sm:text-sm font-Josefin_Sans font-semibold bg-gradient-to-br from-[#91968f] to-[#e5eee2] text-black px-5 py-1.5 rounded-xl cursor-pointer hover:scale-105">Close</button>

                                <button
                                    onClick={() => { submit() }}
                                    className="text-xs sm:text-sm font-Josefin_Sans font-semibold bg-green-800 text-white px-5 py-1.5 rounded-xl cursor-pointer hover:scale-105">{mode}</button>
                            </div>
                        </div>
                    </div>

                    {mode === "delete" && (
                        <div
                            onKeyDown={(e) => {
                                if (e.key == "Enter") {
                                    submit()
                                }
                            }}
                            tabIndex={0}
                            className="h-full w-full absolute transition-all duration-200 z-10 top-0 left-0 bg-white/13 flex justify-center items-center">
                            <div className=" flex flex-col absolute bg-[#26232e] text-white rounded-2xl p-5 xs:p-8 mx-4 xsm:mx-8">
                                <p className="mb-4 text-xs xxs:text-sm sm:text-base font-semibold">Delete Project ?</p>
                                <p className="mb-2 text-xs xxs:text-sm sm:text-base text-white/90">
                                    <span className="">Are you sure you want to delete the Project </span>
                                    <span className="font-extrabold">{name}</span>
                                </p>
                                <p className="mb-6 text-[9px] xxs:text-xs sm:text-sm text-white/40">By clicking 'Delete', this poject with its all tasks will be permanently removed</p>
                                <div className="flex gap-4 self-end">
                                    <button
                                        onClick={() => handleclose()}
                                        className="text-[9px] xxs:text-xs sm:text-sm py-2 px-3 rounded-2xl border-[1px] border-white/50 cursor-pointer">Cancel</button>
                                    <button
                                        onClick={() => submit()}
                                        className="text-[9px] xxs:text-xs sm:text-sm py-2 px-4 rounded-2xl bg-red-500/80 cursor-pointer">Delete</button>
                                </div>

                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-5 pr-1 xsm:pr-2 overflow-x-hidden scrollbar scrollbar-thumb-gray-600 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg scrollbar-hover:scrollbar-thumb-gray-500">

                        {projectlist.length === 0 ? (
                            <div className="flex flex-col gap-10 items-center">
                                <img src={assets.no_project} alt="" className="w-80" />
                                <p className="text-white font-Josefin_Sans font-semibold text-xl text-center">Empty table alert !! Time to click ‘Add Project’ <br /> and get to work!</p>
                            </div>
                        )
                            :
                            (
                                projectlist.map(project => (
                                    <div
                                        onClick={() => navigate(`/kanban/${project.ProjectID}`)}
                                        style={{ borderColor: project.Color }}
                                        className="bg-[#383d5c] border-l-3 xxs:border-l-4 p-2.5 sm:p-4 rounded-xl flex items-center justify-between cursor-pointer capitalize hover:bg-[#262c4b] transition-all duration-250">

                                        <span className="text-[#ffffff] text-xs xxs:text-sm sm:text-lg font-Asap font-semibold truncate w-1/2 lg:w-full">{project.Heading}</span>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleUpdate(project)
                                                }}
                                                className="flex items-center gap-2 px-3 xxs:px-5 md:px-4 py-1 bg-white/80 text-black rounded-xl cursor-pointer hover:scale-105 hover:bg-white transition-all duration-150">
                                                <BiSolidEditAlt className='text-sm xxs:text-base xs:text-lg' />
                                                <span className='text-sm font-semibold hidden md:block'>Rename</span>
                                            </button>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handledelete(project)
                                                }}
                                                className="px-3 xxs:px-5 md:px-4 py-1.5 bg-red-600/60 rounded-xl text-white flex items-center gap-2 cursor-pointer hover:scale-105 hover:bg-red-700/60 transition-all duration-150">
                                                <MdDelete className='text-sm xxs:text-base xs:text-lg' />
                                                <span className='text-sm font-medium hidden md:block'>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                )))}

                    </div>
                </div>

            </div>
        </>
    )
}

export default KanbanPage
