// Environment configuration helper
const getApiBaseUrl = () => {
  // Production environment
  if (process.env.NODE_ENV === "production") {
    return process.env.REACT_APP_API_BASE_URL || "https://your-api-domain.onrender.com/api"
  }

  // Development environment
  return process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api"
}

const config = {
  API_BASE_URL: getApiBaseUrl(),
  NODE_ENV: process.env.NODE_ENV,

  // Feature flags
  ENABLE_LOGGING: process.env.NODE_ENV === "development",
  ENABLE_MOCK_DATA: process.env.REACT_APP_ENABLE_MOCK === "true",

  // API Configuration
  API_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
}

export default config
