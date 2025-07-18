const helmet = require("helmet")
const compression = require("compression")
const rateLimit = require("express-rate-limit")
const mongoSanitize = require("express-mongo-sanitize")

const productionConfig = (app) => {
  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  )

  // Compression middleware
  app.use(compression())

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: "Too many requests from this IP, please try again later.",
    },
  })
  app.use("/api/", limiter)

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize())

  // Health check endpoint
  app.get("/health", (req, res) => {
    const mongoose = require("mongoose")
    res.status(200).json({
      status: "UP",
      timestamp: new Date().toISOString(),
      database: mongoose.connection.readyState === 1 ? "CONNECTED" : "DISCONNECTED",
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    })
  })

  // Global error handler
  app.use((err, req, res, next) => {
    const logger = require("../utils/logger")

    logger.error("Unhandled error:", {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
    })

    if (process.env.NODE_ENV === "production") {
      res.status(500).json({
        error: "Internal Server Error",
        requestId: req.id,
      })
    } else {
      res.status(500).json({
        error: err.message,
        stack: err.stack,
      })
    }
  })
}

module.exports = productionConfig
