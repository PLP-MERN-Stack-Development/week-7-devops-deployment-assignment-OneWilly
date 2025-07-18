const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const auth = require("../middleware/auth")
const logger = require("../utils/logger")

const router = express.Router()

// Register user
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { name, email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: "User already exists with this email" })
      }

      // Create new user
      const user = new User({ name, email, password })
      await user.save()

      // Generate token
      const token = user.generateAuthToken()

      logger.info(`New user registered: ${email}`)

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    } catch (error) {
      logger.error("Registration error:", error)
      res.status(500).json({ error: "Server error during registration" })
    }
  },
)

// Login user
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const { email, password } = req.body

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password")
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ error: "Account is deactivated" })
      }

      // Compare password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Update last login
      user.lastLogin = new Date()
      await user.save()

      // Generate token
      const token = user.generateAuthToken()

      logger.info(`User logged in: ${email}`)

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
      })
    } catch (error) {
      logger.error("Login error:", error)
      res.status(500).json({ error: "Server error during login" })
    }
  },
)

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json({ user })
  } catch (error) {
    logger.error("Get user error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Update user profile
router.put(
  "/profile",
  auth,
  [
    body("name").optional().trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").optional().isEmail().normalizeEmail().withMessage("Please enter a valid email"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Validation failed",
          details: errors.array(),
        })
      }

      const updates = req.body
      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })

      res.json({
        message: "Profile updated successfully",
        user,
      })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: "Email already exists" })
      }
      logger.error("Profile update error:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

module.exports = router
