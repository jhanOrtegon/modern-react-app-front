import { lazy } from 'react'

import type { RouteObject } from 'react-router-dom'

// Lazy load Users components
const UserList = lazy(async () => ({
  default: (await import('../components/UserList')).UserList,
}))
const UserDetail = lazy(async () => ({
  default: (await import('../components/UserDetail')).UserDetail,
}))
const UserForm = lazy(async () => ({
  default: (await import('../components/UserForm')).UserForm,
}))

/**
 * Rutas del módulo de Users
 * Estas rutas están protegidas y requieren autenticación
 */
export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    children: [
      {
        index: true,
        element: <UserList />,
      },
      {
        path: 'new',
        element: <UserForm />,
      },
      {
        path: ':id',
        element: <UserDetail />,
      },
      {
        path: ':id/edit',
        element: <UserForm />,
      },
    ],
  },
]
