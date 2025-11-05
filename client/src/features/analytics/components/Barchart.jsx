import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

const data = [
    { name: "Sun", TaskRemains: 0, TaskComplted: 0 },
    { name: "Mon", TaskRemains: 0, TaskComplted: 0 },
    { name: "Tue", TaskRemains: 0, TaskComplted: 0 },
    { name: "Wed", TaskRemains: 0, TaskComplted: 0 },
    { name: "Thu", TaskRemains: 0, TaskComplted: 0 },
    { name: "Fri", TaskRemains: 0, TaskComplted: 0 },
    { name: "Sat", TaskRemains: 0, TaskComplted: 0 }
];

const StackedBarChart = ({ TimeData }) => {

    const updatedData = data.map((day, index) => ({
        ...day,
        TaskRemains: TimeData?.TaskByDaysRemains?.[index] || 0,
        TaskComplted: TimeData?.TaskByDaysCompleted?.[index] || 0,
    }));
    
      const [isXXS , setisXXS] =useState(window.innerWidth <= 400)
    
      useEffect(()=>{
        const handleResize = () => setisXXS(window.innerWidth <= 400)
        window.addEventListener("resize" , handleResize)
        return () => window.removeEventListener("resize" , handleResize)
      },[])

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={updatedData}
                barCategoryGap={isXXS ?10:15}
                margin={{ top: 10, right: 0, left: -15, bottom: 0 }}
            >
                <XAxis dataKey="name" tickFormatter={isXXS ? () => '' : undefined} />
                <YAxis />
                <Tooltip
                    cursor={{ fill: "#ffffff", fillOpacity: 0.2 }}
                    contentStyle={{
                        backgroundColor: "#1f1f1f",
                        border: "1px solid #5f46e5",
                        borderRadius: "8px",
                        color: "#fff",
                        boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
                    }}
                    labelStyle={{
                        color: "#a78bfa",
                        fontWeight: "bold",
                    }}
                />
                <Bar dataKey="TaskComplted" fill="#B13BC3" />
                <Bar dataKey="TaskRemains" fill="#C7C7C7" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default StackedBarChart;
