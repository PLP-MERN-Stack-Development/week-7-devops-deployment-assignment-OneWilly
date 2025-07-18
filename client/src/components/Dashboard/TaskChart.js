"use client"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"]

export default function TaskChart({ data = [] }) {
  if (!data.length) return <p className="text-gray-600">No data to display.</p>

  const chartData = data.map((d) => ({ name: d._id, value: d.count }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={(d) => `${d.name} (${d.value})`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
