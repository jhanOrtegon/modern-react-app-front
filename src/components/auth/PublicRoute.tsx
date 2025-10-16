import type { ReactElement } from 'react'

import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

interface PublicRouteProps {
  children: ReactElement
}

export function PublicRoute({ children }: PublicRouteProps): ReactElement {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)

  if (isAuthenticated) {
    return <Navigate replace to="/posts" />
  }

  return children
}
