import { useSortable } from '@dnd-kit/sortable'
import { CSS } from "@dnd-kit/utilities"
import assets from '../../../assets/assets'
import { useContext, useEffect, useRef, useState } from 'react'
import { BiSolidEditAlt } from "react-icons/bi";
import { MdDelete } from "react-icons/md"
import { Appcontent } from '../../../context/Appcontext'

export default function Taskcard({ task, index, colId }) {

    const [showMenu, setShowMenu] = useState(false);
    const dropdownRef = useRef(null);
    

    const { openmodel } = useContext(Appcontent)

    useEffect(() => {

        if (!showMenu) return

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.TaskID,
        data: { sortable: { index, colId } },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            key={task.TaskID}
            className="flex flex-col gap-3 py-4 xs:py-6 pl-3 xs:pl-4 pr-12 bg-[#1E2132] rounded-xl [touch-action:none] relative">
            <div className="flex gap-3">
                {
                    task.Priority === 'high' ?
                        <div className="bg-red-800/40 w-fit flex items-center gap-1 py-1 px-2 xl:px-3 rounded-3xl">
                            <img src={assets.high} alt={task.Priority} className="h-2 xs:h-2.5" />
                            <span className="text-[9px] xs:text-xs font-semibold text-red-500">High</span>
                        </div>
                        :
                        task.Priority === 'medium' ?
                            <div className="bg-[#8a791d]/50 w-fit flex items-baseline gap-1 py-1 px-2 xl:px-3 rounded-3xl">
                                <img src={assets.medium} alt="medium" className="h-2 xs:h-2.5" />
                                <span className="text-[9px] xs:text-xs font-semibold text-[#ffd900]">Medium</span>
                            </div>
                            :
                            task.Priority === 'low' ?
                                <div className="bg-[#3fbb2e]/40 w-fit flex items-center gap-1 py-1 px-2 xl:px-3 rounded-3xl">
                                    <img src={assets.low} alt="Low" className="h-2 xs:h-2.5" />
                                    <span className="text-[9px] xs:text-xs font-semibold text-[#81f172]">Low</span>
                                </div>
                                :
                                null
                }

                <span className="text-white text-[9px] xs:text-xs bg-[#225a61] w-fit py-1 px-3 xl:px-6 rounded-3xl">{task.Category}</span>
            </div>

            <span className="text-sm xs:text-base xl:text-lg text-white font-bold font-Josefin_Sans truncate">{task.TaskHeading}</span>
            <span className="text-[10px] xs:text-xs text-white/50 font-bold font-Josefin_Sans truncate">{task.TaskDescription}</span>

            {showMenu && (<div ref={dropdownRef} className="h-18 w-20 bg-[#3b405c] rounded-lg absolute right-7 mt-6 z-10 shadow-[0px_0px_5px_rgba(0,0,0,0.1)] p-1.5 flex flex-col justify-center gap-1.5">

                <div
                    onClick={() => { openmodel("edit", task), setShowMenu(false) }}
                    className="flex items-center justify-center rounded-sm gap-2 font-Share_Tech text-white hover:bg-white/15 pr-4 cursor-pointer">
                    <BiSolidEditAlt className='text-[16px]' />
                    <span className="text-[14px] ">Edit</span>
                </div>

                <div
                    onClick={() => { openmodel("delete", { TaskID: task.TaskID, TaskHeading: task.TaskHeading }), setShowMenu(false) }}
                    className="flex items-center justify-center rounded-sm gap-2 font-Share_Tech text-white hover:bg-red-400/20 cursor-pointer">
                    <MdDelete className='text-[15px] text-red-400' />
                    <span className="text-[14px] text-red-400">Delete</span>
                </div>

            </div>)}

            <div onClick={() => setShowMenu(prev => !prev)} className="h-5 w-fit flex items-center gap-1.5 absolute right-5 top-4 xs:top-6 cursor-pointer">
                <div className="size-[3px] xs:size-1 rounded-full bg-white"></div>
                <div className="size-[3px] xs:size-1 rounded-full bg-white"></div>
                <div className="size-[3px] xs:size-1 rounded-full bg-white"></div>
            </div>
        </div>

    )
}

