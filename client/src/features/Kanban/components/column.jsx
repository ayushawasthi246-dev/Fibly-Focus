import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core"
import Taskcard from "./Taskcard.jsx";
import { useEffect, useState } from "react";

export default function Column({ id, colname, tasks, placeholder }) {

    const { setNodeRef: setDroppableRef } = useDroppable({ id });
    const [columnexpand, setcolumnexpand] = useState({
        todo: true,
        inprogress: true,
        completed: true,
    });

    const toggleColumn = (col) => {
        setcolumnexpand((prev) => ({ ...prev, [col]: !prev[col] }));
    };

    useEffect(() => {
        if (tasks.length === 0) {
            setcolumnexpand((prev) => ({
                ...prev,
                [id]: false,
            }));
        } else {
            setcolumnexpand((prev) => ({
                ...prev,
                [id]: true,
            }));
        }
    }, [tasks, id]);

    return (
        <div className="bg-[#272a3d] lg:w-1/3 min-w-0 rounded-2xl p-3 flex flex-col gap-4">

            <div
                onClick={() => toggleColumn(id)}
                className="px-4 py-2.5 bg-[#393d55] rounded-xl flex items-center justify-between">
                <span className="text-sm sm:text-base text-white">{colname}</span>
                <span className="text-black font-bold text-xs bg-green-500 px-1.5 py-0.5 rounded-full">{tasks.length}</span>
            </div>

            <div ref={setDroppableRef} className={`lg:flex-1 ${columnexpand[id] ? "h-72 sm:h-96" : "h-1"} flex flex-col transition-all duration-200 gap-3.5 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-900 scrollbar-thumb-rounded-lg scrollbar-track-rounded-lg scrollbar-hover:scrollbar-thumb-gray-500`}>

                <SortableContext
                    id={id}
                    items={tasks.map(t => t.TaskID)}
                    strategy={verticalListSortingStrategy}>

                    {tasks.map((task, i) => (
                        <div key={task.TaskID}>
                            {placeholder?.colId === id && placeholder.index === i && (
                                <div className="h-[140px] bg-white/10 mb-4 rounded-xl transition-all"></div>
                            )}

                            <Taskcard task={task} index={i} colId={id} />
                        </div>
                    ))}
                    {placeholder?.colId === id && placeholder.index === tasks.length && (
                        <div className="h-[140px] bg-white/10 rounded-xl transition-all"></div>
                    )}
                </SortableContext>
            </div>
        </div>
    )
}


