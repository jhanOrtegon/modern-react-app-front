import { logger } from '@/lib/logger'

export function getEnvString(
  key: keyof ImportMetaEnv,
  defaultValue = ''
): string {
  const value = import.meta.env[key] as string | undefined
  return value ?? defaultValue
}

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

export function getRequiredEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key] as string | undefined
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Please check your .env file.`
    )
  }
  return value
}

export const apiConfig = {
  baseUrl: getEnvString('VITE_API_BASE_URL'),

  timeout: getEnvNumber('VITE_API_TIMEOUT'),
} as const

export const appConfig = {
  name: getEnvString('VITE_APP_NAME'),

  version: getEnvString('VITE_APP_VERSION'),

  env: getEnvString('VITE_APP_ENV'),

  isDevelopment: import.meta.env.DEV,

  isProduction: import.meta.env.PROD,

  mode: import.meta.env.MODE,
} as const

export const featureFlags = {
  enableDevTools: getEnvBoolean(
    'VITE_ENABLE_DEVTOOLS',
    appConfig.isDevelopment
  ),

  enableDebugLogs: getEnvBoolean('VITE_ENABLE_DEBUG_LOGS'),

  enablePerformanceMonitoring: getEnvBoolean(
    'VITE_ENABLE_PERFORMANCE_MONITORING'
  ),
} as const

export const analyticsConfig = {
  gaTrackingId: getEnvString('VITE_GA_TRACKING_ID'),

  sentryDsn: getEnvString('VITE_SENTRY_DSN'),
} as const

export const uiConfig = {
  itemsPerPage: getEnvNumber('VITE_ITEMS_PER_PAGE'),

  searchDebounce: getEnvNumber('VITE_SEARCH_DEBOUNCE'),
} as const

export const authConfig = {
  sessionTimeout: getEnvNumber('VITE_SESSION_TIMEOUT'),

  oauthClientId: getEnvString('VITE_OAUTH_CLIENT_ID'),
} as const

export const config = {
  api: apiConfig,
  app: appConfig,
  features: featureFlags,
  analytics: analyticsConfig,
  ui: uiConfig,
  auth: authConfig,
} as const

export function printConfig(): void {
  if (!appConfig.isDevelopment) {
    return
  }

  logger.info('⚙️ App Configuration', {
    environment: appConfig.env,
    version: appConfig.version,
    apiUrl: apiConfig.baseUrl,
    apiTimeout: `${apiConfig.timeout}ms`,
    devTools: featureFlags.enableDevTools,
    debugLogs: featureFlags.enableDebugLogs,
    performanceMonitoring: featureFlags.enablePerformanceMonitoring,
    itemsPerPage: uiConfig.itemsPerPage,
  })
}

export function validateEnv(): void {
  try {
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
