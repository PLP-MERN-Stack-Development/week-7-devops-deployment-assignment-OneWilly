"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import api from "../services/api"

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: true,
  error: null,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, loading: true, error: null }
    case "AUTH_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }
    case "AUTH_FAILURE":
      return {
        ...state,
        loading: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null,
      }
    case "UPDATE_USER":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
    case "CLEAR_ERROR":
      return { ...state, error: null }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Set token in localStorage and API headers
  const setAuthToken = useCallback((token) => {
    if (token) {
      localStorage.setItem("token", token)
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      localStorage.removeItem("token")
      delete api.defaults.headers.common["Authorization"]
    }
  }, [])

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      dispatch({ type: "AUTH_FAILURE", payload: "No token found" })
      return
    }

    try {
      setAuthToken(token)
      const response = await api.get("/auth/me")
      dispatch({
        type: "AUTH_SUCCESS",
        payload: { user: response.data.user, token },
      })
    } catch (error) {
      dispatch({ type: "AUTH_FAILURE", payload: error.response?.data?.error || "Authentication failed" })
      setAuthToken(null)
    }
  }, [setAuthToken])

  // Login user
  const login = useCallback(
    async (email, password) => {
      dispatch({ type: "AUTH_START" })

      try {
        const response = await api.post("/auth/login", { email, password })
        const { token, user } = response.data

        setAuthToken(token)
        dispatch({ type: "AUTH_SUCCESS", payload: { user, token } })

        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Login failed"
        dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },
    [setAuthToken],
  )

  // Register user
  const register = useCallback(
    async (userData) => {
      dispatch({ type: "AUTH_START" })

      try {
        const response = await api.post("/auth/register", userData)
        const { token, user } = response.data

        setAuthToken(token)
        dispatch({ type: "AUTH_SUCCESS", payload: { user, token } })

        return { success: true }
      } catch (error) {
        const errorMessage = error.response?.data?.error || "Registration failed"
        dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
        return { success: false, error: errorMessage }
      }
    },
    [setAuthToken],
  )

  // Logout user
  const logout = useCallback(() => {
    setAuthToken(null)
    dispatch({ type: "LOGOUT" })
  }, [setAuthToken])

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await api.put("/auth/profile", userData)
      dispatch({ type: "UPDATE_USER", payload: response.data.user })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Profile update failed"
      return { success: false, error: errorMessage }
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" })
  }, [])

  const value = {
    ...state,
    login,
    register,
    logout,
    checkAuth,
    updateProfile,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
