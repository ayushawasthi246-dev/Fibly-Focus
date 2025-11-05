import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Appcontent } from '../../../context/Appcontext'

const addTask = () => {

    const [taskcard, settaskcard] = useState(true)
    const { BackendURL, model, closemodel } = useContext(Appcontent)
    const [showsuggestions, setshowsuggestions] = useState(false)
    const query = watch("projectname", "")

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    const description = watch("TaskDescription") || ""
    const maxLength = 150

    return (
        <form className="mx-3 xxs:mx-8 xsm:mx-12 lg:mx-0 w-full lg:w-2/3 flex flex-col bg-[#26232e] text-white rounded-2xl p-5 xsm:p-8">

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
                            {...register("projectname", {
                                required: "Task Title is required", maxLength: {
                                    value: 50,
                                    message: "Task Title should not be more then 50 charcters"
                                }
                            })}
                            type="text"
                            maxLength={50}
                            className='border-2 border-white/30 rounded-lg px-3 py-2 w-full text-[10px] xxs:text-xs sm:text-sm focus:outline-none transition-all duration-100 focus:border-green-500 focus:border-2 ' />
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

        </form>
    )
}

export default addTask
