"use client"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/UI/LoadingSpinner"

export default function Register() {
  const navigate = useNavigate()
  const { register, loading } = useAuth()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { success } = await register(form)
    if (success) navigate("/dashboard")
  }

  if (loading) return <LoadingSpinner className="mt-24" />

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-blue-600">Create&nbsp;account</h1>

        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          required
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="mt-4 block text-sm font-medium text-gray-700">Email</label>
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
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign&nbsp;in
          </Link>
        </p>
      </form>
    </div>
  )
}
