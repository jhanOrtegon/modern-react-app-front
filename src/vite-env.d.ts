interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string

  readonly VITE_API_TIMEOUT?: string

  readonly VITE_APP_NAME?: string

  readonly VITE_APP_VERSION?: string

  readonly VITE_APP_ENV?: string

  readonly VITE_ENABLE_DEVTOOLS?: string

  readonly VITE_ENABLE_DEBUG_LOGS?: string

  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string

  readonly VITE_GA_TRACKING_ID?: string

  readonly VITE_SENTRY_DSN?: string

  readonly VITE_ITEMS_PER_PAGE?: string

  readonly VITE_SEARCH_DEBOUNCE?: string

  readonly VITE_SESSION_TIMEOUT?: string

  readonly VITE_OAUTH_CLIENT_ID?: string

  readonly MODE: string

  readonly DEV: boolean

  readonly PROD: boolean

  readonly SSR: boolean

  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
