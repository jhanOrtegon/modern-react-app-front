import { lazy, type ReactElement, Suspense } from 'react'

import { Loader2 } from 'lucide-react'

import { PublicRoute } from '@/components/auth/PublicRoute'

import type { RouteObject } from 'react-router-dom'

// Lazy load Auth components
const LoginPage = lazy(async () => ({
  default: (await import('../pages/LoginPage')).LoginPage,
}))
const RegisterPage = lazy(async () => ({
  default: (await import('../pages/RegisterPage')).RegisterPage,
}))

// eslint-disable-next-line react-refresh/only-export-components
function LoadingFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

/**
 * Rutas públicas del módulo de autenticación
 * Solo accesibles cuando el usuario NO está autenticado
 */
export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingFallback />}>
          <LoginPage />
        </Suspense>
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Suspense fallback={<LoadingFallback />}>
          <RegisterPage />
        </Suspense>
      </PublicRoute>
    ),
  },
]
