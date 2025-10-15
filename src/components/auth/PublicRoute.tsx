import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface PublicRouteProps {
  children: ReactElement
}

/**
 * Componente que protege rutas públicas (login/register)
 * Redirige a /posts si el usuario ya está autenticado
 */
export function PublicRoute({ children }: PublicRouteProps): ReactElement {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate replace to="/posts" />
  }

  return children
}
