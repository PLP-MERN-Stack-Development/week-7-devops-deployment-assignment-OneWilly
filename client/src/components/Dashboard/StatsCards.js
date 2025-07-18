"use client"

export default function StatsCards({ stats }) {
  const cards = [
    { label: "Total Tasks", value: stats.totalTasks, color: "bg-blue-500" },
    { label: "Overdue Tasks", value: stats.overdueTasks, color: "bg-red-500" },
    {
      label: "Completed",
      value: stats.statusStats.find((s) => s._id === "completed")?.count || 0,
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      value: stats.statusStats.find((s) => s._id === "in-progress")?.count || 0,
      color: "bg-yellow-500 text-gray-900",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-lg p-4 text-white shadow ${c.color}`}>
          <p className="text-sm uppercase tracking-wide opacity-80">{c.label}</p>
          <p className="mt-2 text-3xl font-bold">{c.value}</p>
        </div>
      ))}
    </div>
  )
}
