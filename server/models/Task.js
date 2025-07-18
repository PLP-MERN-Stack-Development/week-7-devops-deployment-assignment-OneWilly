const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (date) => date > new Date(),
        message: "Due date must be in the future",
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
taskSchema.index({ assignedTo: 1, status: 1 })
taskSchema.index({ createdBy: 1 })
taskSchema.index({ dueDate: 1 })

// Update completedAt when status changes to completed
taskSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "completed") {
    this.completedAt = new Date()
  } else if (this.isModified("status") && this.status !== "completed") {
    this.completedAt = undefined
  }
  next()
})

module.exports = mongoose.model("Task", taskSchema)
