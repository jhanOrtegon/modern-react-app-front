/* eslint-disable react-refresh/only-export-components */
import { type ReactElement, Suspense } from 'react'

import { Loader2 } from 'lucide-react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { AppLayout } from '../components/layout/AppLayout'
import { accountsRoutes } from '../modules/accounts/presentation/routes/accountsRoutes'
import { authRoutes } from '../modules/auth/presentation/routes/authRoutes'
import { postsRoutes } from '../modules/posts/presentation/routes/postsRoutes'
import { usersRoutes } from '../modules/users/presentation/routes/usersRoutes'

function LoadingFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

export const router = createBrowserRouter([
  ...authRoutes,

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

          ...postsRoutes,
          ...usersRoutes,
          ...accountsRoutes,

          {
            path: '*',
            element: <Navigate replace to="/posts" />,
          },
        ],
      },
    ],
  },
])
