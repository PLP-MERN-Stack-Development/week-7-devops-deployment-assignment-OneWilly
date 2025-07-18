const express = require("express")
const { body, query, validationResult } = require("express-validator")
const Task = require("../models/Task")
const auth = require("../middleware/auth")
const logger = require("../utils/logger")

const router = express.Router()

// Get all tasks with filtering and pagination
router.get(
  "/",
  auth,
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("status").optional().isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),
    query("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
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

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit

      // Build filter object
      const filter = { assignedTo: req.user.id }

      if (req.query.status) filter.status = req.query.status
      if (req.query.priority) filter.priority = req.query.priority
      if (req.query.search) {
        filter.$or = [
          { title: { $regex: req.query.search, $options: "i" } },
          { description: { $regex: req.query.search, $options: "i" } },
        ]
      }

      // Get tasks with pagination
      const tasks = await Task.find(filter)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const total = await Task.countDocuments(filter)

      res.json({
        tasks,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      })
    } catch (error) {
      logger.error("Get tasks error:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Get single task
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    // Check if user has access to this task
    if (task.assignedTo._id.toString() !== req.user.id && task.createdBy._id.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" })
    }

    res.json({ task })
  } catch (error) {
    logger.error("Get task error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Create new task
router.post(
  "/",
  auth,
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title is required and must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
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

      const taskData = {
        ...req.body,
        assignedTo: req.user.id,
        createdBy: req.user.id,
      }

      const task = new Task(taskData)
      await task.save()

      await task.populate("createdBy", "name email")
      await task.populate("assignedTo", "name email")

      logger.info(`New task created: ${task.title} by user ${req.user.id}`)

      res.status(201).json({
        message: "Task created successfully",
        task,
      })
    } catch (error) {
      logger.error("Create task error:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Update task
router.put(
  "/:id",
  auth,
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("status").optional().isIn(["pending", "in-progress", "completed"]).withMessage("Invalid status"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Invalid priority"),
    body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
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

      const task = await Task.findById(req.params.id)

      if (!task) {
        return res.status(404).json({ error: "Task not found" })
      }

      // Check if user has permission to update
      if (task.assignedTo.toString() !== req.user.id && task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ error: "Access denied" })
      }

      const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")

      logger.info(`Task updated: ${updatedTask.title} by user ${req.user.id}`)

      res.json({
        message: "Task updated successfully",
        task: updatedTask,
      })
    } catch (error) {
      logger.error("Update task error:", error)
      res.status(500).json({ error: "Server error" })
    }
  },
)

// Delete task
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) {
      return res.status(404).json({ error: "Task not found" })
    }

    // Check if user has permission to delete
    if (task.assignedTo.toString() !== req.user.id && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Access denied" })
    }

    await Task.findByIdAndDelete(req.params.id)

    logger.info(`Task deleted: ${task.title} by user ${req.user.id}`)

    res.json({ message: "Task deleted successfully" })
  } catch (error) {
    logger.error("Delete task error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

// Get task statistics
router.get("/stats/dashboard", auth, async (req, res) => {
  try {
    const userId = req.user.id

    const stats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const priorityStats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ])

    const overdueTasks = await Task.countDocuments({
      assignedTo: userId,
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    })

    res.json({
      statusStats: stats,
      priorityStats,
      overdueTasks,
      totalTasks: await Task.countDocuments({ assignedTo: userId }),
    })
  } catch (error) {
    logger.error("Get stats error:", error)
    res.status(500).json({ error: "Server error" })
  }
})

module.exports = router
