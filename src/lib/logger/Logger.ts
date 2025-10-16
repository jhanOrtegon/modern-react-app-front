type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  module?: string
  userId?: number
  accountId?: number
  action?: string
  [key: string]: unknown
}

type LogStyles = Record<LogLevel, string>

class Logger {
  private readonly isDevelopment: boolean

  constructor() {
    this.isDevelopment = import.meta.env.DEV
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    if (!this.isDevelopment && level === 'debug') {
      return
    }

    const timestamp = new Date().toISOString()

    if (this.isDevelopment) {
      const styles: LogStyles = {
        debug: 'color: #888',
        info: 'color: #00f',
        warn: 'color: #f80',
        error: 'color: #f00; font-weight: bold',
      }

      /* eslint-disable no-console */
      console.log(
        `%c[${level.toUpperCase()}] ${timestamp} ${message}`,
        styles[level],
        context ?? ''
      )
      /* eslint-enable no-console */
    } else {
      const logEntry = {
        level: level.toUpperCase(),
        message,
        timestamp,
        ...context,
      }

      /* eslint-disable no-console */
      console.log(JSON.stringify(logEntry))
      /* eslint-enable no-console */
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    }
    this.log('error', message, errorContext)
  }
}

export const logger = new Logger()
