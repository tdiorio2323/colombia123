/**
 * Password Hashing Utilities
 *
 * Provides secure password hashing and comparison using bcrypt.
 * Uses industry-standard salt rounds (10) for security/performance balance.
 */

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a plain text password
 *
 * @param password - Plain text password to hash
 * @returns Hashed password string
 * @throws Error if hashing fails
 *
 * @example
 * const hashedPassword = await hashPassword('mySecurePass123');
 * // Returns: "$2b$10$xR5..."
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    return hash;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Compare a plain text password with a hashed password
 *
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match, false otherwise
 *
 * @example
 * const isValid = await comparePassword('userInput123', storedHash);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    return false;
  }
}

/**
 * Validate password strength
 *
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 *
 * @param password - Password to validate
 * @returns Object with isValid boolean and optional error message
 *
 * @example
 * const validation = validatePasswordStrength('weak');
 * if (!validation.isValid) {
 *   console.log(validation.error); // "Password must be at least 8 characters"
 * }
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters long',
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  return { isValid: true };
}

/**
 * Check if a password needs to be rehashed
 * (e.g., if SALT_ROUNDS has been increased)
 *
 * @param hashedPassword - Current hashed password
 * @returns true if password should be rehashed
 */
export function shouldRehashPassword(hashedPassword: string): boolean {
  try {
    const rounds = bcrypt.getRounds(hashedPassword);
    return rounds < SALT_ROUNDS;
  } catch {
    return false;
  }
}
