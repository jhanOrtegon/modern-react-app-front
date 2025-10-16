import * as React from 'react'

import * as ReactDOM from 'react-dom/client'

import '@/index.css'

import App from './App.tsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { ThemeProvider } from './components/theme-provider'
import { printConfig, validateEnv } from './config/env'
import { logger } from './lib/logger'
import { reportWebVitals } from './lib/performance'

try {
  validateEnv()
} catch (error) {
  logger.error(
    '❌ Environment validation failed. Please check your .env files.',
    error as Error
  )
  throw error
}

printConfig()

const root = document.getElementById('root')

if (!root) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the ID is correct."
  )
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

void reportWebVitals()
