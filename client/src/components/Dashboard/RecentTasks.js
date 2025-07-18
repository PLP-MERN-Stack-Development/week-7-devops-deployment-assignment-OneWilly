"use client"
import { Link } from "react-router-dom"

export default function RecentTasks({ tasks = [] }) {
  if (!tasks.length) return <p className="text-gray-600">No recent tasks.</p>

  return (
    <ul className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <li key={task._id} className="py-3">
          <Link to={`/tasks/${task._id}`} className="flex items-center justify-between">
            <span className="font-medium text-blue-600">{task.title}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {task.status}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
