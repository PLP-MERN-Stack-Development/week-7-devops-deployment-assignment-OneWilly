const jwt = require("jsonwebtoken")
const User = require("../models/User")
const logger = require("../utils/logger")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Check if user still exists
    const user = await User.findById(decoded.id)
    if (!user || !user.isActive) {
      return res.status(401).json({ error: "Invalid token. User not found or inactive." })
    }

    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    }

    next()
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." })
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired." })
    }

    logger.error("Auth middleware error:", error)
    res.status(500).json({ error: "Server error during authentication." })
  }
}

module.exports = auth
