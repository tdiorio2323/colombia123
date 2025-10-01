import { body, param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

// Validation error handler
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: errors.array().map((error) => ({
        field: error.type === "field" ? error.path : "unknown",
        message: error.msg,
        value: error.type === "field" ? error.value : undefined,
      })),
    });
    return;
  }
  next();
};

// User validation rules
export const validateUserRegistration = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 8, max: 128 })
    .withMessage("Password must be between 8 and 128 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  body("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  body("role")
    .isIn(["creator", "fan"])
    .withMessage("Role must be either creator or fan"),
  handleValidationErrors,
];

export const validateUserLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Profile validation rules
export const validateProfileUpdate = [
  body("display_name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Display name must be between 1 and 100 characters")
    .trim()
    .escape(),
  body("bio")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters")
    .trim()
    .escape(),
  body("username")
    .optional()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  handleValidationErrors,
];

// Payment validation rules
export const validateTipRequest = [
  body("creatorId").isUUID().withMessage("Creator ID must be a valid UUID"),
  body("userId").isUUID().withMessage("User ID must be a valid UUID"),
  body("amount")
    .isInt({ min: 100, max: 100000 }) // $1.00 to $1000.00 in cents
    .withMessage("Amount must be between $1.00 and $1000.00"),
  body("message")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Message must not exceed 200 characters")
    .trim()
    .escape(),
  body("paymentMethodId")
    .matches(/^pm_[a-zA-Z0-9]{24,}$/)
    .withMessage("Invalid payment method ID format"),
  handleValidationErrors,
];

export const validateSubscriptionRequest = [
  body("creatorId").isUUID().withMessage("Creator ID must be a valid UUID"),
  body("userId").isUUID().withMessage("User ID must be a valid UUID"),
  body("paymentMethodId")
    .matches(/^pm_[a-zA-Z0-9]{24,}$/)
    .withMessage("Invalid payment method ID format"),
  handleValidationErrors,
];

export const validateSetupIntentRequest = [
  body("userId").isUUID().withMessage("User ID must be a valid UUID"),
  handleValidationErrors,
];

// Creator validation rules
export const validateCreatorSettings = [
  body("subscription_price")
    .optional()
    .isInt({ min: 499, max: 99999 }) // $4.99 to $999.99 in cents
    .withMessage("Subscription price must be between $4.99 and $999.99"),
  body("tip_enabled")
    .optional()
    .isBoolean()
    .withMessage("Tip enabled must be a boolean"),
  handleValidationErrors,
];

// File upload validation
export const validateFileUpload = [
  body("title")
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters")
    .trim()
    .escape(),
  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description must not exceed 1000 characters")
    .trim()
    .escape(),
  body("tags")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Maximum 10 tags allowed"),
  body("tags.*")
    .optional()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters")
    .trim()
    .escape(),
  body("is_premium")
    .optional()
    .isBoolean()
    .withMessage("Is premium must be a boolean"),
  handleValidationErrors,
];

// Message validation
export const validateMessage = [
  body("recipientId").isUUID().withMessage("Recipient ID must be a valid UUID"),
  body("content")
    .notEmpty()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Message content must be between 1 and 2000 characters")
    .trim()
    .escape(),
  body("type")
    .optional()
    .isIn(["text", "image", "video"])
    .withMessage("Message type must be text, image, or video"),
  handleValidationErrors,
];

// Search and pagination validation
export const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Page must be between 1 and 1000"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("sort")
    .optional()
    .isIn(["newest", "oldest", "popular", "trending"])
    .withMessage("Sort must be newest, oldest, popular, or trending"),
  handleValidationErrors,
];

export const validateSearch = [
  query("q")
    .notEmpty()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters")
    .trim()
    .escape(),
  query("type")
    .optional()
    .isIn(["creators", "content", "all"])
    .withMessage("Search type must be creators, content, or all"),
  ...validatePagination,
];

// URL parameter validation
export const validateCreatorId = [
  param("creatorId").isUUID().withMessage("Creator ID must be a valid UUID"),
  handleValidationErrors,
];

export const validateUserId = [
  param("userId").isUUID().withMessage("User ID must be a valid UUID"),
  handleValidationErrors,
];

export const validateUsername = [
  param("username")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and hyphens",
    ),
  handleValidationErrors,
];

// Sanitization helpers
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
};

export const sanitizeObject = (
  obj: Record<string, any>,
): Record<string, any> => {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Content type validation
export const validateContentType = (allowedTypes: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentType = req.get("Content-Type");

    if (
      !contentType ||
      !allowedTypes.some((type) => contentType.includes(type))
    ) {
      res.status(415).json({
        error: "Unsupported content type",
        code: "UNSUPPORTED_CONTENT_TYPE",
        allowedTypes,
      });
      return;
    }

    next();
  };
};
