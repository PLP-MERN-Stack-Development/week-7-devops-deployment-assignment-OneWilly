"use client"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>
      <p className="mt-4 text-xl text-gray-700">Sorry, page not found.</p>
      <Link to="/dashboard" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Go&nbsp;home
      </Link>
    </div>
  )
}
