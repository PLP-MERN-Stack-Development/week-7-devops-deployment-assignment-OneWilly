"use client"
import { useToast } from "../../contexts/ToastContext"

const toastColors = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
  warning: "bg-yellow-600 text-gray-900",
}

export default function Toast() {
  const { toasts } = useToast()

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-full max-w-sm rounded-md px-4 py-3 text-white shadow-lg ${toastColors[toast.type] || toastColors.info}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
