import type { ReactElement } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { config } from './config'
// import { ErrorBoundaryTest } from './components/shared/ErrorBoundaryTest'
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

function App(): ReactElement {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
      {/* 🔍 DevTools solo si está habilitado en .env */}
      {config.features.enableDevTools ? (
        <ReactQueryDevtools initialIsOpen={false} />
      ) : null}
      {/* Descomentar para probar el ErrorBoundary */}
      {/* <ErrorBoundaryTest /> */}
    </QueryClientProvider>
  )
}

export default App
