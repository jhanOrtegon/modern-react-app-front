import '@/index.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'

const root = document.getElementById('root')

if (!root) {
  throw new Error(
    "Root element not found. Check if it's in your index.html or if the ID is correct."
  )
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
