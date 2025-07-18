"use client"

import React, { Suspense, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { TaskProvider } from "./contexts/TaskContext"
import { ToastProvider } from "./contexts/ToastContext"
import Navbar from "./components/Layout/Navbar"
import LoadingSpinner from "./components/UI/LoadingSpinner"
import Toast from "./components/UI/Toast"
import "./App.css"

// Lazy load components
const Login = React.lazy(() => import("./pages/Login"))
const Register = React.lazy(() => import("./pages/Register"))
const Dashboard = React.lazy(() => import("./pages/Dashboard"))
const Tasks = React.lazy(() => import("./pages/Tasks"))
const Profile = React.lazy(() => import("./pages/Profile"))
const NotFound = React.lazy(() => import("./pages/NotFound"))

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return user ? children : <Navigate to="/login" />
}

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return !user ? children : <Navigate to="/dashboard" />
}

function AppContent() {
  const { user, checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}

      <main className={user ? "pt-16" : ""}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <TaskProvider>
                    <Dashboard />
                  </TaskProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskProvider>
                    <Tasks />
                  </TaskProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Toast />
    </div>
  )
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
