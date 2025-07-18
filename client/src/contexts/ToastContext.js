"use client"

import { createContext, useCallback, useContext, useReducer } from "react"

const ToastContext = createContext()

let toastId = 0

const initialState = {
  toasts: [],
}

function toastReducer(state, action) {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.payload] }
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.payload) }
    default:
      return state
  }
}

export const ToastProvider = ({ children }) => {
  const [state, dispatch] = useReducer(toastReducer, initialState)

  const showToast = useCallback((message, type = "info", duration = 4000) => {
    const id = ++toastId
    dispatch({ type: "ADD_TOAST", payload: { id, message, type } })
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", payload: id }), duration)
  }, [])

  const value = { ...state, showToast }

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}
