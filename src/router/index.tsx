import { type ReactElement, Suspense } from 'react'

import { Loader2 } from 'lucide-react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { accountsRoutes } from '../modules/accounts/presentation/routes/accountsRoutes'
import { authRoutes } from '../modules/auth/presentation/routes/authRoutes'
import { postsRoutes } from '../modules/posts/presentation/routes/postsRoutes'
import { usersRoutes } from '../modules/users/presentation/routes/usersRoutes'

// eslint-disable-next-line react-refresh/only-export-components
function LoadingFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

/**
 * Configuración principal del router
 *
 * Estructura:
 * - Rutas públicas (auth): /login, /register
 * - Rutas protegidas: Requieren autenticación
 *   - Posts: /posts/*
 *   - Users: /users/*
 *   - Accounts: /accounts/*
 *
 * Beneficios de esta arquitectura:
 * - Rutas organizadas por módulo
 * - Lazy loading automático
 * - Fácil escalabilidad (agregar nuevos módulos)
 * - Separación de responsabilidades
 */
export const router = createBrowserRouter([
  // Rutas públicas (Auth module)
  ...authRoutes,

  // Rutas protegidas
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <AppLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: <Navigate replace to="/posts" />,
          },
          // Rutas de módulos
          ...postsRoutes,
          ...usersRoutes,
          ...accountsRoutes,
          // Ruta catch-all
          {
            path: '*',
            element: <Navigate replace to="/posts" />,
          },
        ],
      },
    ],
  },
])
