import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Appcontent } from '../../../context/Appcontext'
import { FaCaretDown } from "react-icons/fa";
import axios from 'axios';
import { toast } from 'react-toastify';

const addTask = ({ settaskcard, isodateformate, fetchtasks }) => {

    const { BackendURL, model, closemodel} = useContext(Appcontent)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm();

    const [showsuggestions, setshowsuggestions] = useState(false)
    const query = watch("Projectname", "")
    const [projects, setprojects] = useState([])
    const description = watch("TaskDescription") || ""
    const maxLength = 150

    const fectchprojects = async () => {
        try {
            const res = await axios.get(BackendURL + `/calendar/projects`, { withCredentials: true })

            if (res.data?.success) {
                setprojects(res.data.ProjectData)
            } else {
                toast.error(res.data?.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        fectchprojects()
    }, [])

    const filterprojects = projects.filter((p) =>
        (p.Heading || "").toLowerCase().includes(query.toLowerCase())
    )

    useEffect(() => {
        if (model.type === "edit") {
            settaskcard(true)

            reset({
                TaskHeading: model.data.Heading,
                TaskDescription: model.data.Description,
                Projectname: model.data.Project,
                Priority: model.data.Priority,
                Category: model.data.Category
            })
        } else {
            reset({
                TaskHeading: "",
                TaskDescription: "",
                Projectname: "",
                Priority: "high",
                Category: "study"
            })
        }

        if (model.type === "delete") {
            settaskcard(true)
        }
    }, [model])

    const deleteTask = async () => {
        try {
            const res = await axios.delete(BackendURL + `/calendar/deletetask`, {
                data: { Taskid: model.data.TaskID },
                withCredentials: true
            })
            if (res.data?.success) {
                await fetchtasks()
                settaskcard(false)
                closemodel()
                toast.success(res.data?.message)
            } else {
                toast.error(res.data?.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong")
        }
    }

    const onSubmit = async (data) => {
        try {
            let res
            if (model.type === "edit") {
                res = await axios.post(BackendURL + "/calendar/edittask", { ...data, Taskid: model.data.Taskid }, { withCredentials: true })
            } else {
                res = await axios.post(BackendURL + `/calendar/createtask`, { ...data, Date: isodateformate }, { withCredentials: true })
            }
            if (res.data?.success) {
                await fetchtasks()
                settaskcard(false)
                closemodel()
                toast.success(res.data?.message)
            } else {
                toast.error(res.data?.message)
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong heree");
        }
    }

    return (
        <>
            {model?.type !== "delete" ? (
                <form onSubmit={handleSubmit(onSubmit, onerror)}
                    className="mx-3 xxs:mx-8 xsm:mx-12 lg:mx-0 w-full lg:w-2/3 flex flex-col bg-[#26232e] text-white rounded-2xl p-5 xsm:p-8 border sm:border-0 border-white">

                    <p className="text-sm xxs:text-lg sm:text-2xl text-white font-bold font-Exo_2 mb-1.5">{model?.type === "edit" ? "Update Your Task" : "Add Task"}</p>
                    <p className="text-[10px] xxs:text-xs sm:text-sm font-semibold text-white/60 mb-7">Fill in the form below to create or modify a task</p>

                    <div className="flex gap-3 xsm:gap-5 ">

                        <div className="flex flex-col gap-4 w-1/2">
                            <div className="">
                                <label className="block text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold mb-1">Task Title</label>
                                <input
                                    autoComplete="off"
                                    placeholder="Enter the Task Title."
                                    {...register("TaskHeading", {
                                        required: "Task Title is required", maxLength: {
                                            value: 50,
                                            message: "Task Title should not be more then 50 charcters"
                                        }
                                    })}
                                    type="text"
                                    maxLength={50}
                                    className='border-2 border-white/30 rounded-lg px-3 py-2 w-full text-[10px] xxs:text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2 ' />
                            </div>

                            <div className="">
                                <label className="block text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold mb-1">Task Description</label>
                                <textarea
                                    {...register("TaskDescription", {
                                        maxLength: {
                                            value: 150,
                                            message: "Description should not be more then 50 charcters"
                                        }
                                    })}
                                    className="border-2 border-white/30 rounded-lg px-3 py-2 w-full text-[10px] xxs:text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2 resize-none"
                                    rows="5"
                                    maxLength={maxLength}
                                    placeholder="Enter task description..."
                                ></textarea>
                                <div className="text-right text-[10px] xxs:text-xs sm:text-sm">
                                    <span
                                        className={
                                            description.length >= maxLength
                                                ? "text-red-500 font-semibold"
                                                : "text-gray-500"
                                        }
                                    >
                                        {description.length} / {maxLength} chracter
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:gap-4 w-1/2">

                            <div className="relative">
                                <label className="block text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold mb-1">Project name</label>
                                <input
                                    autoComplete="off"
                                    placeholder="Enter the project name."
                                    {...register("Projectname", {
                                        required: "project name is required", maxLength: {
                                            value: 50,
                                            message: "project name should not be more then 50 charcters"
                                        }
                                    })}
                                    onFocus={() => setshowsuggestions(true)}
                                    onBlur={() => setshowsuggestions(false)}
                                    type="text"
                                    maxLength={50}
                                    className='border-2 border-white/30 rounded-lg px-3 py-2 w-full text-[10px] xxs:text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2 ' />

                                {showsuggestions && query &&
                                    (<div className={`absolute bg-[#26232e] z-40 ${filterprojects.length <= 0 ? "hidden" : ""} border-[1px] border-t-0 border-white/30 rounded-sm w-full text-xs flex flex-col `}>
                                        {filterprojects.length > 0 ? (
                                            filterprojects.map((p) => (
                                                <div
                                                    key={p.ProjectID}
                                                    onMouseDown={() => {
                                                        setValue("Projectname", p.Heading)
                                                        setshowsuggestions(false)
                                                    }}
                                                    className="text-sm text-white truncate hover:bg-blue-500 py-1.5 px-3 cursor-pointer">{p.Heading}</div>
                                            ))) : (
                                            <div className=""></div>
                                        )
                                        }
                                    </div>)
                                }
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold mb-1">Priority</label>
                                <select
                                    {...register("Priority", {
                                        required: "You have to mention the priority of the task"
                                    })}
                                    className='border-2 border-white/30 rounded-lg px-3 py-2 appearance-none  w-full text-[10px] xxs:text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2 bg-[#26232e]'>
                                    <option value="high">high</option>
                                    <option value="medium">medium</option>
                                    <option value="low">low</option>
                                </select>
                                <FaCaretDown className="text-sm xxs:text-lg sm:text-2xl z-20 absolute top-7.5 xxs:top-7 sm:top-8 right-2 pointer-events-none" />
                            </div>

                            <div className="relative">
                                <label className="block text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold mb-1">Category</label>
                                <select
                                    {...register("Category", {
                                        required: "You must mention the task Category"
                                    })}
                                    className='border-2 border-white/30 rounded-lg px-3 py-2 appearance-none  w-full text-[10px] xxs:text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2 bg-[#26232e]'>
                                    <option value="study">study</option>
                                    <option value="work">work</option>
                                    <option value="personal">personal</option>
                                    <option value="other">other</option>
                                </select>
                                <FaCaretDown className="text-sm xxs:text-lg sm:text-2xl z-20 absolute top-7.5 xxs:top-7 sm:top-8 right-2 pointer-events-none" />
                            </div>
                        </div>

                    </div>

                    <div className="pt-5 mt-5 flex justify-end gap-6 border-t-2 border-white/30">
                        <button type='button'
                            onClick={() => {
                                settaskcard(false)
                                if (model?.type === "edit") {
                                    closemodel()
                                }
                            }}
                            className="text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold bg-gradient-to-br from-[#91968f] to-[#e5eee2] text-black px-3 xxs:px-5 py-1.5 rounded-xl cursor-pointer hover:scale-105">Close</button>

                        <button type='submit' className="text-[10px] xxs:text-xs sm:text-sm font-Josefin_Sans font-semibold bg-green-800 text-white px-3 xxs:px-5 py-1.5 rounded-xl cursor-pointer hover:scale-105">
                            {model?.type === "edit" ? "Update" : "Create Task"}
                        </button>
                    </div>

                </form>) : (
                <div
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            deleteTask()
                        }
                    }}
                    tabIndex={0}
                    className="h-full w-full absolute transition-all duration-200 z-10 top-0 left-0 bg-white/13 flex justify-center items-center">
                    <div className="flex flex-col absolute bg-[#26232e] text-white rounded-2xl p-5 xsm:p-8 mx-4 xsm:mx-8">
                        <p className="mb-4 text-xs xxs:text-sm sm:text-base font-semibold">Delete Task ?</p>
                        <p className="mb-2 text-xs xxs:text-sm sm:text-base text-white/90">
                            <span className="">Are you sure you want to delete the task </span>
                            <span className="font-extrabold">{`${model.data.TaskHeading}`}</span>
                        </p>
                        <p className="mb-6 text-xs sm:text-sm text-white/40">By clicking 'Delete', this task will be permanently removed.</p>
                        <div className="flex gap-4 self-end">
                            <button
                                onClick={() => { settaskcard(false); closemodel() }}
                                className="text-[9px] xxs:text-xs sm:text-sm py-2 px-3 rounded-2xl border-[1px] border-white/50 cursor-pointer">Cancel</button>
                            <button
                                onClick={() => deleteTask()}
                                className="text-[9px] xxs:text-xs sm:text-sm py-2 px-4 rounded-2xl bg-red-500/80 cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default addTask
