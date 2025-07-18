"use client"
import { useEffect } from "react"
import { useTask } from "../contexts/TaskContext"
import LoadingSpinner from "../components/UI/LoadingSpinner"

export default function Tasks() {
  const { tasks, fetchTasks, loading } = useTask()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  if (loading) return <LoadingSpinner className="mt-24" />

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">My Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-600">No tasks yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200 rounded-lg bg-white shadow">
          {tasks.map((task) => (
            <li key={task._id} className="p-4">
              <p className="font-medium text-blue-600">{task.title}</p>
              <p className="text-sm text-gray-600">{task.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
