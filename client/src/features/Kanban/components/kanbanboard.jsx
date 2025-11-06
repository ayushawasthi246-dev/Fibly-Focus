import { DndContext, DragOverlay, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import Column from "./column.jsx";
import { arrayMove } from "@dnd-kit/sortable";
import Taskcard from "./Taskcard.jsx";
import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Appcontent } from "../../../context/Appcontext.jsx";

export default function Kabanboard({ columns, setColumns }) {

    const { BackendURL, setnotification } = useContext(Appcontent)

    const [activeTask, setActiveTask] = useState(null);

    const [placeholder, setPlaceholder] = useState({
        colId: null,
        index: null,
    });

    const taskmove = ({ active, over }) => {

        const Taskid = active.id
        const activecol = active?.data?.current?.sortable?.colId
        const destcol = over?.data?.current?.sortable?.colId || over?.id;
        const destTasks = columns[destcol].tasks;

        let destidx;
        if (over?.data?.current) {
            destidx = over.data.current.sortable?.index;
        } else {
            destidx = destTasks.length;
        }

        let newidx;

        if (destTasks.length === 0) {
            newidx = 1;
        }
        else if (destidx === 0 && destTasks.length > 1) {
            newidx = destTasks[1].index / 2
        }
        else if (destidx === 0) {
            newidx = destTasks[0].index / 2
        }
        else if (destidx >= destTasks.length) {
            newidx = destTasks[destTasks.length - 1].index + 1
        }
        else {
            let downidx
            if (activecol === destcol) {
                downidx = destTasks[destidx + 1].index
            } else {
                downidx = destTasks[destidx].index
            }
            const upidx = destTasks[destidx - 1].index
            newidx = (downidx + upidx) / 2
        }

        return { Taskid, newcol: destcol, newidx, oldcol: activecol }
    }


    const handleDragStart = (event) => {
        const { active } = event;

        for (const colKey in columns) {
            const task = columns[colKey].tasks.find(t => t.TaskID === active.id);
            if (task) {
                setActiveTask(task);
                break;
            }
        }
    }

    const handleDragEnd = async (event) => {

        const { active, over } = event

        if (!over) {
            setPlaceholder({ colId: null, index: null })
            setActiveTask(null)
            return;
        }

        const sourcecol = active.data?.current?.sortable?.colId;
        const destcol = over?.data?.current?.sortable?.colId || over?.id

        if (sourcecol === destcol) {
            const update = { ...columns };
            update[sourcecol].tasks = arrayMove(
                update[sourcecol].tasks,
                active.data.current.sortable.index,
                over.data.current.sortable.index
            );
            setColumns(update);

        } else {
            const SourceTasks = [...columns[sourcecol].tasks];
            const DestTasks = [...columns[destcol].tasks];

            const [movedtask] = SourceTasks.splice(active.data.current.sortable.index, 1);
            movedtask.Status = destcol;

            const destIndex = over.data.current?.sortable?.index ?? DestTasks.length;
            DestTasks.splice(destIndex, 0, movedtask);

            setColumns({
                ...columns,
                [sourcecol]: { ...columns[sourcecol], tasks: SourceTasks },
                [destcol]: { ...columns[destcol], tasks: DestTasks },
            });
        }

        setPlaceholder({ colId: null, index: null })
        setActiveTask(null)

        const { Taskid, newcol, newidx, oldcol } = taskmove({ active, over })

        setColumns(prev => {
            const updated = { ...prev }
            const taskList = [...updated[newcol].tasks]
            const taskIndex = taskList.findIndex(t => t.TaskID === Taskid)

            if (taskIndex !== -1) {
                taskList[taskIndex] = { ...taskList[taskIndex], index: newidx }
                updated[newcol] = { ...updated[newcol], tasks: taskList }
            }
            return updated
        })

        try {
            const res = await axios.post(BackendURL + "/kanban/updateposition", { Taskid, newcol, newidx, oldcol }, { withCredentials: true })
            if (res.data?.success) {
                if (newcol === "completed") {
                    setnotification({ idx: newidx, show: true })
                }
            } else {
                toast.error(res.data?.message)
            }
        } catch (err) {
            toast.error(err.res?.data?.message || "Something went wrong")
        }
    }

    const handleDragOver = (event) => {
        const { active, over } = event;

        if (!over) return;

        const sourceCol = active.data.current.sortable.colId;
        const destCol = over.data.current?.sortable?.colId || over.id;

        if (sourceCol !== destCol) {
            const destTasks = columns[destCol]?.tasks || []
            const overIndex = over?.id ? destTasks.findIndex(t => t.TaskID === over.id) : -1;
            const insertIndex = overIndex >= 0 ? overIndex : destTasks.length;

            setPlaceholder({ colId: destCol, index: insertIndex })
        }

    }

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 15,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                tolerance: 5,
            },
        })
    );

    return (
        <DndContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            sensors={sensors}
        >
            {Object.entries(columns).map(([key, col]) => (
                <Column key={key} id={key} colname={col.name} tasks={col.tasks || []} placeholder={placeholder} />
            ))}
            <DragOverlay>
                {activeTask ? (
                    <div className="cursor-grabbing">
                        <Taskcard task={activeTask} />
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}

