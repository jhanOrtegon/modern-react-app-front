import type { ReactElement } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

export function ProtectedRoute(): ReactElement {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
