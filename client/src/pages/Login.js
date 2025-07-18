"use client"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/UI/LoadingSpinner"

export default function Login() {
  const navigate = useNavigate()
  const { login, loading } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { success } = await login(form.email, form.password)
    if (success) navigate("/dashboard")
  }

  if (loading) return <LoadingSpinner className="mt-24" />

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-blue-600">Sign&nbsp;in</h1>

        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label className="mt-4 block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit" className="mt-6 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700">
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}
