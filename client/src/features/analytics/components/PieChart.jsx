import { useEffect, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';

const data = [
  { value: null, fill: '#b15abe' },
  { value: null, fill: '#59d37a' },
  { value: null, fill: '#FAD156' },
  { value: null, fill: '#b8b7b7' },
];
const Catogrydata = [
  { name: "work", value: null, fill: '#9c3daa' },
  { name: "study", value: null, fill: '#30944b' },
  { name: "personal", value: null, fill: '#FAD156' },
  { name: "other", value: null, fill: '#b8b7b7' },
]

const Prioritydata = [
  { name: "high", value: null, fill: '#f14b4b' },
  { name: "medium", value: null, fill: '#c0ac3a' },
  { name: "low", value: null, fill: '#3fbb2e' },
]

export default function PieChartWithPaddingAngle({ pieChartData }) {

  const focusArray = Array.isArray(pieChartData?.focusByCategory)
    ? pieChartData.focusByCategory
    : Object.keys(pieChartData?.focusByCategory || {});

  const selected = pieChartData?.graphOn === "Category" ? Catogrydata : Prioritydata

  const updatedCatogryData = selected.map((day) => ({
    ...day,
    value: focusArray.includes(day.name)
      ? pieChartData?.focusByCategory?.[day.name]
      : null,
  }))

  const allNull = updatedCatogryData.every((item) => item.value === null || item.value === 0)

  const nonNullCount = updatedCatogryData.filter((item) => item.value !== null && item.value !== 0).length

  const finalData = allNull
    ? [{ name: "work", value: 1, fill: '#444B7C' }]
    : updatedCatogryData

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={finalData}
          innerRadius="45%"
          outerRadius="70%"
          paddingAngle={0}
          labelLine={false}
          stroke="none"
          label={!allNull ? ({ x, y, value }) => (
            <text
              x={x}
              y={y}
              fill="white"
              fontSize={13}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {value}
            </text>
          ) : false}
          dataKey="value"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}