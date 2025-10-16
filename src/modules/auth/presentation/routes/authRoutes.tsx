/* eslint-disable react-refresh/only-export-components */
import { lazy, type ReactElement, Suspense } from 'react'

import { Loader2 } from 'lucide-react'

import { PublicRoute } from '@/components/auth/PublicRoute'

import type { RouteObject } from 'react-router-dom'

const LoginPage = lazy(async () => ({
  default: (await import('../pages/LoginPage')).LoginPage,
}))
const RegisterPage = lazy(async () => ({
  default: (await import('../pages/RegisterPage')).RegisterPage,
}))

function LoadingFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

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
