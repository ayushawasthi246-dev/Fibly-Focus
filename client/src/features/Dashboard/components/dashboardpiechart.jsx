import { useState , useEffect } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts"

const PieChartTasks = ({ ToDoTasks, InProgressTasks, completedTasks, belowXSM }) =>{

  const COLORS = ["#FF7F7F", "#FFC658", "#82CA9D"];

  const data = [
    { name: "TO DO", value: ToDoTasks === 0 ? null : ToDoTasks },
    { name: "In Progress", value: InProgressTasks === 0 ? null : InProgressTasks },
    { name: "Completed", value: completedTasks === 0 ? null : completedTasks },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const firstNonNullIndex = data.findIndex(item => item.value !== null);
    setActiveIndex(firstNonNullIndex === -1 ? null : firstNonNullIndex);
  }, [ToDoTasks, InProgressTasks, completedTasks]);

  const onPieEnter = (_, index) => setActiveIndex(index);

  return (
    <div className="h-full w-full">
      <div
        className="absolute top-1/2 left-1/2 -translate-[50%] text-sm xsm:text-lg text-white font-semibold font-Cuprum pointer-events-none">
        {activeIndex !== null ? data[activeIndex].name : "none"}
      </div>

      <ResponsiveContainer>
        <PieChart>
          {(data[0].value === null && data[1].value === null && data[2].value === null) ?
            <Pie
              data={[{ value: 1 }]} // just a dummy full circle
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={belowXSM ? 60 : 70}
              outerRadius={belowXSM ? 80 : 100}
              stroke="none"
              fill="#871399"
            />
            :
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={belowXSM ? 50 : 70}
              outerRadius={belowXSM ? 70 : 100}
              paddingAngle={2}
              x={40}
              y={50}
              onMouseEnter={onPieEnter}
              labelLine={false}
              label={({ x, y, value }) => {
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    fontSize={belowXSM ? 14 : 17}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {value}
                  </text>
                )
              }}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  style={{
                    transition: "transform 0.2s ease",
                    transformOrigin: "center",
                    transform:
                      activeIndex === index ? `scale(1.02) ` : `scale(1)`,
                    cursor: "pointer",
                  }}
                />
              ))}
            </Pie>
          }

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieChartTasks;
