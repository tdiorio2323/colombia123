import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs");

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

// Define log colors
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  verbose: "grey",
  debug: "blue",
  silly: "rainbow",
};

winston.addColors(logColors);

// Custom format for structured logging
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    // Handle error objects
    if (info.stack) {
      return JSON.stringify({
        timestamp,
        level,
        message,
        stack: info.stack,
        ...meta,
      });
    }

    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta,
    });
  }),
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;

    let metaStr = "";
    if (Object.keys(meta).length > 0) {
      metaStr = "\n" + JSON.stringify(meta, null, 2);
    }

    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels: logLevels,
  defaultMeta: {
    service: "creator-platform",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production" ? customFormat : consoleFormat,
    }),

    // File transport for errors (always enabled)
    new DailyRotateFile({
      filename: path.join(logsDir, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      level: "error",
      format: customFormat,
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
    }),

    // File transport for all logs (production only)
    ...(process.env.NODE_ENV === "production"
      ? [
          new DailyRotateFile({
            filename: path.join(logsDir, "combined-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            format: customFormat,
            maxSize: "20m",
            maxFiles: "14d",
            zippedArchive: true,
          }),

          // HTTP request logs
          new DailyRotateFile({
            filename: path.join(logsDir, "requests-%DATE%.log"),
            datePattern: "YYYY-MM-DD",
            level: "http",
            format: customFormat,
            maxSize: "20m",
            maxFiles: "7d",
            zippedArchive: true,
          }),
        ]
      : []),
  ],

  // Handle exceptions and rejections
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      format: customFormat,
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      format: customFormat,
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
});

// Log uncaught exceptions and unhandled rejections
if (process.env.NODE_ENV === "production") {
  logger.exitOnError = false;
}

// Specialized logging functions
export const loggers = {
  // General application logging
  app: logger,

  // Payment and financial logging
  payment: logger.child({ category: "payment" }),

  // Security and authentication logging
  security: logger.child({ category: "security" }),

  // Performance and monitoring
  performance: logger.child({ category: "performance" }),

  // Database operations
  database: logger.child({ category: "database" }),

  // External API calls
  api: logger.child({ category: "external_api" }),
};

// Express middleware for HTTP request logging
export const httpLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    const contentLength = res.get("content-length") || 0;

    loggers.app.http("HTTP Request", {
      method,
      url,
      statusCode,
      ip,
      userAgent: req.get("User-Agent"),
      duration: `${duration}ms`,
      contentLength: `${contentLength} bytes`,
      // Include user ID if available
      userId: req.user?.id,
      // Flag suspicious activity
      suspicious: statusCode >= 400 || duration > 5000,
    });
  });

  next();
};

// Error logging helper
export const logError = (error: Error, context: Record<string, any> = {}) => {
  loggers.app.error(error.message, {
    name: error.name,
    stack: error.stack,
    ...context,
  });
};

// Payment logging helpers
export const logPayment = {
  success: (paymentData: Record<string, any>) => {
    loggers.payment.info("Payment successful", {
      type: "payment_success",
      ...paymentData,
    });
  },

  failure: (error: string, paymentData: Record<string, any>) => {
    loggers.payment.warn("Payment failed", {
      type: "payment_failure",
      error,
      ...paymentData,
    });
  },

  attempt: (paymentData: Record<string, any>) => {
    loggers.payment.info("Payment attempt", {
      type: "payment_attempt",
      ...paymentData,
    });
  },
};

// Security logging helpers
export const logSecurity = {
  authSuccess: (userId: string, ip: string) => {
    loggers.security.info("Authentication successful", {
      type: "auth_success",
      userId,
      ip,
    });
  },

  authFailure: (email: string, ip: string, reason: string) => {
    loggers.security.warn("Authentication failed", {
      type: "auth_failure",
      email,
      ip,
      reason,
    });
  },

  rateLimitHit: (ip: string, endpoint: string) => {
    loggers.security.warn("Rate limit exceeded", {
      type: "rate_limit_hit",
      ip,
      endpoint,
    });
  },

  suspiciousActivity: (description: string, context: Record<string, any>) => {
    loggers.security.warn("Suspicious activity detected", {
      type: "suspicious_activity",
      description,
      ...context,
    });
  },
};

// Performance logging helpers
export const logPerformance = {
  slow: (
    operation: string,
    duration: number,
    context: Record<string, any> = {},
  ) => {
    loggers.performance.warn("Slow operation detected", {
      type: "slow_operation",
      operation,
      duration: `${duration}ms`,
      ...context,
    });
  },

  metric: (name: string, value: number, unit: string = "ms") => {
    loggers.performance.info("Performance metric", {
      type: "performance_metric",
      metric: name,
      value,
      unit,
    });
  },
};

// Database logging helpers
export const logDatabase = {
  query: (query: string, duration: number, success: boolean) => {
    const level = success ? "debug" : "error";
    const message = success
      ? "Database query executed"
      : "Database query failed";

    loggers.database[level](message, {
      type: "db_query",
      query: query.substring(0, 200), // Truncate long queries
      duration: `${duration}ms`,
      success,
    });
  },

  connection: (action: string, success: boolean, error?: string) => {
    const level = success ? "info" : "error";

    loggers.database[level](`Database ${action}`, {
      type: "db_connection",
      action,
      success,
      error,
    });
  },
};

export default logger;
