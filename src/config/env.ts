/**
 * 🔧 Environment Configuration Module
 *
 * Módulo centralizado para acceder a variables de entorno de forma segura y tipada.
 * Proporciona helpers para parseo, validación y valores por defecto.
 *
 * @module config/env
 */

import { logger } from '@/lib/logger'

/**
 * Helper para obtener una variable de entorno como string
 * @param key - Nombre de la variable (sin prefijo VITE_)
 * @param defaultValue - Valor por defecto si no existe
 * @returns Valor de la variable o el default
 */
export function getEnvString(
  key: keyof ImportMetaEnv,
  defaultValue = ''
): string {
  const value = import.meta.env[key] as string | undefined
  return value ?? defaultValue
}

/**
 * Helper para obtener una variable de entorno como número
 * @param key - Nombre de la variable (sin prefijo VITE_)
 * @param defaultValue - Valor por defecto si no existe o no es válido
 * @returns Valor numérico o el default
 */
export function getEnvNumber(
  key: keyof ImportMetaEnv,
  defaultValue = 0
): number {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    return defaultValue
  }

  const parsed = Number(value)
  if (Number.isNaN(parsed)) {
    logger.warn(
      `Invalid number for ${key}: ${value}, using default: ${defaultValue}`
    )
    return defaultValue
  }

  return parsed
}

/**
 * Helper para obtener una variable de entorno como boolean
 * @param key - Nombre de la variable (sin prefijo VITE_)
 * @param defaultValue - Valor por defecto si no existe
 * @returns true si el valor es 'true', '1', 'yes', 'on' (case insensitive)
 */
export function getEnvBoolean(
  key: keyof ImportMetaEnv,
  defaultValue = false
): boolean {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    return defaultValue
  }

  const normalizedValue = value.toLowerCase().trim()
  return ['true', '1', 'yes', 'on'].includes(normalizedValue)
}

/**
 * Helper para obtener una variable REQUERIDA
 * Lanza error si la variable no existe
 * @param key - Nombre de la variable (sin prefijo VITE_)
 * @throws Error si la variable no está definida
 */
export function getRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    )
  }
  return value
}

// ====================================
// 🌐 API Configuration
// ====================================
export const apiConfig = {
  /** URL base de la API */
  baseUrl: getEnvString(
    'VITE_API_BASE_URL',
    'https://jsonplaceholder.typicode.com'
  ),

  /** Timeout para requests HTTP (ms) */
  timeout: getEnvNumber('VITE_API_TIMEOUT', 10000),
} as const

// ====================================
// 📱 App Information
// ====================================
export const appConfig = {
  /** Nombre de la aplicación */
  name: getEnvString('VITE_APP_NAME', 'Modern React App'),

  /** Versión actual */
  version: getEnvString('VITE_APP_VERSION', '1.0.0'),

  /** Entorno actual */
  env: getEnvString('VITE_APP_ENV', 'development'),

  /** Indica si está en modo desarrollo */
  isDevelopment: import.meta.env.DEV,

  /** Indica si está en modo producción */
  isProduction: import.meta.env.PROD,

  /** Modo de Vite */
  mode: import.meta.env.MODE,
} as const

// ====================================
// 🔍 Feature Flags
// ====================================
export const featureFlags = {
  /** Habilitar React Query DevTools */
  enableDevTools: getEnvBoolean(
    'VITE_ENABLE_DEVTOOLS',
    appConfig.isDevelopment
  ),

  /** Habilitar logs de debug */
  enableDebugLogs: getEnvBoolean('VITE_ENABLE_DEBUG_LOGS', false),

  /** Habilitar monitoreo de performance */
  enablePerformanceMonitoring: getEnvBoolean(
    'VITE_ENABLE_PERFORMANCE_MONITORING',
    false
  ),
} as const

// ====================================
// 📊 Analytics & Monitoring
// ====================================
export const analyticsConfig = {
  /** Google Analytics Tracking ID */
  gaTrackingId: getEnvString('VITE_GA_TRACKING_ID'),

  /** Sentry DSN */
  sentryDsn: getEnvString('VITE_SENTRY_DSN'),
} as const

// ====================================
// 🎨 UI Configuration
// ====================================
export const uiConfig = {
  /** Número de items por página */
  itemsPerPage: getEnvNumber('VITE_ITEMS_PER_PAGE', 9),

  /** Debounce para búsquedas (ms) */
  searchDebounce: getEnvNumber('VITE_SEARCH_DEBOUNCE', 300),
} as const

// ====================================
// 🔐 Authentication Configuration
// ====================================
export const authConfig = {
  /** Timeout de sesión (minutos) */
  sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT', 30),

  /** OAuth Client ID */
  oauthClientId: getEnvString('VITE_OAUTH_CLIENT_ID'),
} as const

/**
 * Configuración completa de la aplicación
 * Exportación consolidada de todas las configuraciones
 */
export const config = {
  api: apiConfig,
  app: appConfig,
  features: featureFlags,
  analytics: analyticsConfig,
  ui: uiConfig,
  auth: authConfig,
} as const

/**
 * Imprime la configuración actual en consola (solo en desarrollo)
 * Útil para debugging
 */
export function printConfig(): void {
  if (!appConfig.isDevelopment) {
    return
  }

  /* eslint-disable no-console */
  console.group('⚙️ App Configuration')
  console.log('Environment:', appConfig.env)
  console.log('Version:', appConfig.version)
  console.log('API URL:', apiConfig.baseUrl)
  console.log('API Timeout:', apiConfig.timeout, 'ms')
  console.log('DevTools:', featureFlags.enableDevTools)
  console.log('Debug Logs:', featureFlags.enableDebugLogs)
  console.log(
    'Performance Monitoring:',
    featureFlags.enablePerformanceMonitoring
  )
  console.log('Items Per Page:', uiConfig.itemsPerPage)
  console.groupEnd()
  /* eslint-enable no-console */
}

/**
 * Valida que todas las variables requeridas estén presentes
 * En modo desarrollo, solo muestra advertencias
 * En producción, lanza errores
 */
export function validateEnv(): void {
  try {
    // Validar que la API URL esté configurada
    if (!import.meta.env.VITE_API_BASE_URL) {
      const message =
        '⚠️  VITE_API_BASE_URL not set, using default: https://jsonplaceholder.typicode.com'

      if (appConfig.isProduction) {
        logger.warn(message)
      } else {
        logger.info(message)
      }
    }

    logger.info('✅ Environment variables validated successfully')
  } catch (error) {
    logger.error('❌ Environment validation failed:', error as Error)
    throw error
  }
}
