"use client"

import { useEffect } from "react"
import { useTask } from "../contexts/TaskContext"
import { useAuth } from "../contexts/AuthContext"
import StatsCards from "../components/Dashboard/StatsCards"
import RecentTasks from "../components/Dashboard/RecentTasks"
import TaskChart from "../components/Dashboard/TaskChart"
import LoadingSpinner from "../components/UI/LoadingSpinner"

const Dashboard = () => {
  const { user } = useAuth()
  const { fetchTasks, fetchStats, tasks, stats, loading } = useTask()

  useEffect(() => {
    fetchStats()
    fetchTasks(1, { limit: 5 }) // Fetch recent tasks
  }, [fetchStats, fetchTasks])

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening with your tasks today.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Charts and Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Task Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Task Status Overview</h2>
          <TaskChart data={stats.statusStats} />
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Tasks</h2>
          <RecentTasks tasks={tasks.slice(0, 5)} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Create New Task
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
            View All Tasks
          </button>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors">
            Overdue Tasks
          </button>
          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
