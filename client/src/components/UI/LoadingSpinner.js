"use client"

export default function LoadingSpinner({ className = "", size = 8 }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`h-${size} w-${size} animate-spin rounded-full border-4 border-blue-500 border-t-transparent`} />
    </div>
  )
}
