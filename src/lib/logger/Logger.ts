type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  module?: string
  userId?: number
  accountId?: number
  action?: string
  [key: string]: unknown
}

type LogStyles = Record<LogLevel, string>

/**
 * Logger centralizado para la aplicación
 *
 * Características:
 * - Logs con niveles (debug, info, warn, error)
 * - Contexto adicional opcional
 * - Solo muestra debug en desarrollo
 * - Preparado para integración con servicios externos (Sentry, LogRocket)
 *
 * @example
 * ```typescript
 * logger.info('Usuario creado', { module: 'users', userId: 123 })
 * logger.error('Error al crear post', error, { module: 'posts' })
 * ```
 */
class Logger {
  private readonly isDevelopment: boolean

  constructor() {
    // Vite uses import.meta.env.MODE
    this.isDevelopment = true // Siempre true por ahora
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    // En desarrollo, no mostrar debug en algunos casos
    if (!this.isDevelopment && level === 'debug') {
      return
    }

    // En desarrollo: console con colores
    if (this.isDevelopment) {
      const styles: LogStyles = {
        debug: 'color: #888',
        info: 'color: #00f',
        warn: 'color: #f80',
        error: 'color: #f00; font-weight: bold',
      }

      // eslint-disable-next-line no-console
      console.log(
        `%c[${level.toUpperCase()}] ${message}`,
        styles[level],
        context ?? ''
      )
    }

    // En producción: enviar a servicio de logging
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      // TODO: Integrar con Sentry, LogRocket, etc.
      // Sentry.captureMessage(message, {
      //   level: level as SeverityLevel,
      //   extra: logData,
      // })
    }
  }

  /**
   * Log de debug (solo en desarrollo)
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context)
  }

  /**
   * Log informativo
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  /**
   * Log de advertencia
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  /**
   * Log de error
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const errorContext = {
      ...context,
      error: error?.message,
      stack: error?.stack,
    }
    this.log('error', message, errorContext)
  }
}

/**
 * Instancia global del logger
 */
export const logger = new Logger()
