/**
 * Client-side logger utility
 * Provides consistent logging interface across the client application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class ClientLogger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (context && Object.keys(context).length > 0) {
      return `${prefix} ${message} ${JSON.stringify(context)}`;
    }

    return `${prefix} ${message}`;
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;

    // In production, only log warnings and errors
    return level === 'warn' || level === 'error';
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error | LogContext, context?: LogContext): void {
    if (this.shouldLog('error')) {
      if (error instanceof Error) {
        console.error(
          this.formatMessage('error', message, {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...context,
          })
        );
      } else {
        console.error(this.formatMessage('error', message, error));
      }
    }
  }
}

// Export singleton instance
const logger = new ClientLogger();

export default logger;

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error | LogContext, context?: LogContext) =>
  logger.error(message, error, context);
