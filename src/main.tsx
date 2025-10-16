import * as React from 'react'

import * as ReactDOM from 'react-dom/client'

import '@/index.css'

import App from './App.tsx'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { ThemeProvider } from './components/theme-provider'
import { printConfig, validateEnv } from './config/env'
import { reportWebVitals } from './lib/performance'

// 🔧 Validar variables de entorno requeridas al inicio
try {
  validateEnv()
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(
    '❌ Environment validation failed. Please check your .env files.'
  )
  throw error
}

// 🐛 Imprimir configuración en desarrollo (debugging)
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

// 🚀 Inicializar monitoreo de Web Vitals
void reportWebVitals()
