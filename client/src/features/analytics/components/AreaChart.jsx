import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Sun', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
  { name: 'Mon', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
  { name: 'Tue', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
  { name: 'Wed', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
  { name: 'Thu', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
  { name: 'Fri', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
  { name: 'Sat', Pomodoro: 0, FocusMode: 0, TotalFocusTime: 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#1f1f1f',
          border: '1px solid #5f46e5',
          borderRadius: '8px',
          color: '#fff',
          padding: '8px 12px',
          boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        <p style={{ color: '#a78bfa', fontWeight: 'bold', marginBottom: '6px' }}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ margin: 0, color: entry.color }}>
            {entry.name} : {entry.value} min
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StackedAreaChart = ({ FocusData }) => {

  const updatedData = data.map((day, index) => ({
    ...day,
    Pomodoro: FocusData?.promodoroByDays?.[index] || 0,
    FocusMode: FocusData?.focusModeByDays?.[index] || 0,
    TotalFocusTime: FocusData?.focusByDays?.[index] || 0,
  }))

  const [isXXS, setisXXS] = useState(window.innerWidth <= 400)

  useEffect(() => {
    const handleResize = () => setisXXS(window.innerWidth <= 400)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={updatedData}
        margin={{
          top: 10,
          right: 20,
          left: -20,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" tickFormatter={isXXS ? () => '' : undefined} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="TotalFocusTime" stackId="1" stroke="#ffc658" fill="#ffc658" />
        <Area type="monotone" dataKey="Pomodoro" stroke="#8884d8" fill="#8884d8" />
        <Area type="monotone" dataKey="FocusMode" stroke="#82ca9d" fill="#82ca9d" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StackedAreaChart;
