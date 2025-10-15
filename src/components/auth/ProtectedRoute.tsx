import type { ReactElement } from 'react'

import { Navigate, Outlet } from 'react-router-dom'

import { useAuthStore } from '../../stores/authStore'

/**
 * Componente que protege rutas requiriendo autenticación
 */
export function ProtectedRoute(): ReactElement {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />
  }

  return <Outlet />
}
