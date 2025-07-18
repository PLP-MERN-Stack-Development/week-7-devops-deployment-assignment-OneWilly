/**
 * Helper to determine the correct API URL based on environment
 */
export const getApiUrl = () => {
  // Check if we're in development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5000/api"
  }

  // Check for environment variable first
  if (process.env.REACT_APP_API_BASE_URL) {
    return process.env.REACT_APP_API_BASE_URL
  }

  // Fallback URLs based on common deployment patterns
  const hostname = window.location.hostname

  if (hostname.includes("vercel.app")) {
    // If frontend is on Vercel, backend might be on Render
    return "https://your-backend-service.onrender.com/api"
  }

  if (hostname.includes("netlify.app")) {
    return "https://your-backend-service.onrender.com/api"
  }

  // Default fallback
  return "https://your-backend-service.onrender.com/api"
}

/**
 * Test API connection
 */
export const testApiConnection = async () => {
  const apiUrl = getApiUrl()

  try {
    const response = await fetch(`${apiUrl.replace("/api", "")}/health`)
    const data = await response.json()

    console.log("✅ API Connection Test:", {
      url: apiUrl,
      status: response.status,
      data,
    })

    return { success: true, url: apiUrl, data }
  } catch (error) {
    console.error("❌ API Connection Failed:", {
      url: apiUrl,
      error: error.message,
    })

    return { success: false, url: apiUrl, error: error.message }
  }
}
