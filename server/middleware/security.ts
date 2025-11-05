import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import helmet from "helmet";
import { Request, Response, NextFunction } from "express";
import { logError, logSecurity } from "../lib/logger";

// General rate limiting - 100 requests per 15 minutes per IP
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    logSecurity.rateLimitHit(req.ip || "unknown", req.path);
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: Math.round(
        req.rateLimit?.resetTime?.getTime()
          ? req.rateLimit.resetTime.getTime() / 1000
          : Date.now() / 1000,
      ),
    });
  },
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later.",
    code: "AUTH_RATE_LIMIT_EXCEEDED",
  },
  skipSuccessfulRequests: true, // Don't count successful requests
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many authentication attempts, please try again later.",
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      retryAfter: Math.round(
        req.rateLimit?.resetTime?.getTime()
          ? req.rateLimit.resetTime.getTime() / 1000
          : Date.now() / 1000,
      ),
    });
  },
});

// Payment rate limiting - more restrictive
export const paymentRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Limit each IP to 10 payment requests per windowMs
  message: {
    error: "Too many payment attempts, please try again later.",
    code: "PAYMENT_RATE_LIMIT_EXCEEDED",
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many payment attempts, please try again later.",
      code: "PAYMENT_RATE_LIMIT_EXCEEDED",
      retryAfter: Math.round(
        req.rateLimit?.resetTime?.getTime()
          ? req.rateLimit.resetTime.getTime() / 1000
          : Date.now() / 1000,
      ),
    });
  },
});

// Upload rate limiting
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 uploads per hour
  message: {
    error: "Too many upload attempts, please try again later.",
    code: "UPLOAD_RATE_LIMIT_EXCEEDED",
  },
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: "Too many upload attempts, please try again later.",
      code: "UPLOAD_RATE_LIMIT_EXCEEDED",
      retryAfter: Math.round(
        req.rateLimit?.resetTime?.getTime()
          ? req.rateLimit.resetTime.getTime() / 1000
          : Date.now() / 1000,
      ),
    });
  },
});

// Slow down middleware - progressively delay responses
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // Allow 50 requests per windowMs without delay
  delayMs: (hits) => hits * 100, // Add 100ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
});

// Security headers using Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "https://fonts.googleapis.com",
        ...(process.env.NODE_ENV === "development" ? ["'unsafe-inline'"] : []),
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: [
        "'self'",
        "https://js.stripe.com", // Stripe JS
        ...(process.env.NODE_ENV === "development"
          ? ["'unsafe-inline'", "'unsafe-eval'"]
          : []),
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com", // Stripe API
        "https://*.stripe.com", // Stripe services
        process.env.NODE_ENV === "development" ? "ws://localhost:*" : "",
      ].filter(Boolean),
      frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"], // Stripe frames
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      ...(process.env.NODE_ENV === "production" && {
        upgradeInsecureRequests: [],
      }),
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Stripe compatibility
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  // Note: permissionsPolicy was removed in Helmet v8+
  // Use Permissions-Policy header directly if needed
});

// IP whitelist for admin functions (if needed)
export const adminIPWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP =
      req.ip || req.connection.remoteAddress || req.socket.remoteAddress;

    if (process.env.NODE_ENV === "development") {
      return next(); // Skip IP check in development
    }

    if (allowedIPs.includes(clientIP as string)) {
      next();
    } else {
      res.status(403).json({
        error: "Access denied from this IP address",
        code: "IP_NOT_ALLOWED",
      });
    }
  };
};

// Request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  const { method, url, ip } = req;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { statusCode } = res;

    // Log to console (in production, use a proper logger like Winston)
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        method,
        url,
        statusCode,
        duration: `${duration}ms`,
        ip,
        userAgent: req.get("User-Agent"),
        // Only log sensitive info in development
        ...(process.env.NODE_ENV === "development" && {
          headers: req.headers,
          body: req.body,
        }),
      }),
    );
  });

  next();
};

// Error handling middleware
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logError(error, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === "development";

  res.status(error.status || 500).json({
    error: isDevelopment ? error.message : "Internal server error",
    code: error.code || "INTERNAL_ERROR",
    ...(isDevelopment && { stack: error.stack }),
  });
};

// CORS configuration
export const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173", // Vite dev server
      "http://localhost:8080", // Production local
      "http://localhost:8081", // Backup port
      "http://localhost:8082", // Backup port
      "http://localhost:8083", // Backup port
      "http://localhost:8084", // Current dev port
      process.env.CLIENT_URL,
      process.env.PRODUCTION_URL,
    ].filter(Boolean) as string[];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
