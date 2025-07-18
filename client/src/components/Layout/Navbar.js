"use client"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export default function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-40 h-16 bg-white shadow-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="text-xl font-semibold text-blue-600">
          Task&nbsp;Manager
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/tasks" className="text-gray-700 hover:text-blue-600">
            Tasks
          </Link>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600">
            {user?.name}
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
