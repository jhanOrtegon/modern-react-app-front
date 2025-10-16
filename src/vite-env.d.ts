/// <reference types="vite/client" />

/**
 * TypeScript definitions for Vite Environment Variables
 *
 * Todas las variables deben tener el prefijo VITE_ para ser expuestas al cliente.
 * Las variables se cargan desde archivos .env según el modo:
 * - .env.local (siempre, ignorado por git)
 * - .env.development (modo development)
 * - .env.production (modo production)
 * - .env (base para todos los entornos)
 */
interface ImportMetaEnv {
  // ====================================
  // 🌐 API Configuration
  // ====================================
  /** URL base de la API (ej: https://api.example.com) */
  readonly VITE_API_BASE_URL?: string

  /** Timeout para requests HTTP en milisegundos */
  readonly VITE_API_TIMEOUT?: string

  // ====================================
  // 📱 App Information
  // ====================================
  /** Nombre de la aplicación */
  readonly VITE_APP_NAME?: string

  /** Versión actual de la aplicación */
  readonly VITE_APP_VERSION?: string

  /** Entorno actual (development | staging | production) */
  readonly VITE_APP_ENV?: string

  // ====================================
  // 🔍 Feature Flags
  // ====================================
  /** Habilitar React Query DevTools */
  readonly VITE_ENABLE_DEVTOOLS?: string

  /** Habilitar logs de debug en consola */
  readonly VITE_ENABLE_DEBUG_LOGS?: string

  /** Habilitar monitoreo de performance (Web Vitals) */
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string

  // ====================================
  // 📊 Analytics & Monitoring (Opcional)
  // ====================================
  /** Google Analytics Tracking ID */
  readonly VITE_GA_TRACKING_ID?: string

  /** Sentry DSN para error tracking */
  readonly VITE_SENTRY_DSN?: string

  // ====================================
  // 🎨 UI Configuration
  // ====================================
  /** Número de items por página en paginación */
  readonly VITE_ITEMS_PER_PAGE?: string

  /** Tiempo de debounce para búsquedas en ms */
  readonly VITE_SEARCH_DEBOUNCE?: string

  // ====================================
  // 🔐 Authentication (Opcional)
  // ====================================
  /** Tiempo de expiración de sesión en minutos */
  readonly VITE_SESSION_TIMEOUT?: string

  /** OAuth Client ID */
  readonly VITE_OAUTH_CLIENT_ID?: string

  // ====================================
  // ⚙️ Vite Built-in Variables
  // ====================================
  /** Modo actual (development | production) */
  readonly MODE: string

  /** Indica si está en modo desarrollo */
  readonly DEV: boolean

  /** Indica si está en modo producción */
  readonly PROD: boolean

  /** Indica si es Server-Side Rendering */
  readonly SSR: boolean

  /** URL base de la aplicación */
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
