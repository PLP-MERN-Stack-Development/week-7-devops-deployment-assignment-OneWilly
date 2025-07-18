"use client"
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" })
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { success } = await updateProfile(form)
    setSaved(success)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">My Profile</h1>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label className="mt-4 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border px-3 py-2"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button type="submit" className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Save&nbsp;changes
        </button>

        {saved && <p className="mt-3 text-sm text-green-600">Profile updated!</p>}
      </form>
    </div>
  )
}
