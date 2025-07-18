"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import api from "../services/api"
import { useToast } from "./ToastContext"

const TaskContext = createContext()

const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  pagination: {
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false,
  },
  filters: {
    status: "",
    priority: "",
    search: "",
  },
  stats: {
    statusStats: [],
    priorityStats: [],
    overdueTasks: 0,
    totalTasks: 0,
  },
}

const taskReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false }
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload.tasks,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      }
    case "SET_CURRENT_TASK":
      return { ...state, currentTask: action.payload }
    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        stats: {
          ...state.stats,
          totalTasks: state.stats.totalTasks + 1,
        },
      }
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => (task._id === action.payload._id ? action.payload : task)),
        currentTask: state.currentTask?._id === action.payload._id ? action.payload : state.currentTask,
      }
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task._id !== action.payload),
        stats: {
          ...state.stats,
          totalTasks: Math.max(0, state.stats.totalTasks - 1),
        },
      }
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case "SET_STATS":
      return { ...state, stats: action.payload }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState)
  const { showToast } = useToast()

  // Fetch tasks with filters and pagination
  const fetchTasks = useCallback(
    async (page = 1, filters = {}) => {
      dispatch({ type: "SET_LOADING", payload: true })

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
          ...filters,
        })

        const response = await api.get(`/tasks?${params}`)
        dispatch({ type: "SET_TASKS", payload: response.data })
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch tasks"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        showToast(errorMessage, "error")
      }
    },
    [showToast],
  )

  // Fetch single task
  const fetchTask = useCallback(
    async (taskId) => {
      dispatch({ type: "SET_LOADING", payload: true })

      try {
        const response = await api.get(`/tasks/${taskId}`)
        dispatch({ type: "SET_CURRENT_TASK", payload: response.data.task })
        dispatch({ type: "SET_LOADING", payload: false })
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to fetch task"
        dispatch({ type: "SET_ERROR", payload: errorMessage })
        showToast(errorMessage, "error")
      }
    },
    [showToast],
  )

  // Create new task
  const createTask = useCallback(
    async (taskData) => {
      try {
        const response = await api.post("/tasks", taskData)
        dispatch({ type: "ADD_TASK", payload: response.data.task })
        showToast("Task created successfully", "success")
        return { success: true, task: response.data.task }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to create task"
        showToast(errorMessage, "error")
        return { success: false, error: errorMessage }
      }
    },
    [showToast],
  )

  // Update task
  const updateTask = useCallback(
    async (taskId, taskData) => {
      try {
        const response = await api.put(`/tasks/${taskId}`, taskData)
        dispatch({ type: "UPDATE_TASK", payload: response.data.task })
        showToast("Task updated successfully", "success")
        return { success: true, task: response.data.task }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to update task"
        showToast(errorMessage, "error")
        return { success: false, error: errorMessage }
      }
    },
    [showToast],
  )

  // Delete task
  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await api.delete(`/tasks/${taskId}`)
        dispatch({ type: "DELETE_TASK", payload: taskId })
        showToast("Task deleted successfully", "success")
        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Failed to delete task"
        showToast(errorMessage, "error")
        return { success: false, error: errorMessage }
      }
    },
    [showToast],
  )

  // Fetch dashboard stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get("/tasks/stats/dashboard")
      dispatch({ type: "SET_STATS", payload: response.data })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }, [])

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters })
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" })
  }, [])

  const value = {
    ...state,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
    fetchStats,
    setFilters,
    clearError,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
