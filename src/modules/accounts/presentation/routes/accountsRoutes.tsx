import { lazy } from 'react'

import type { RouteObject } from 'react-router-dom'

// Lazy load Accounts components
const AccountList = lazy(async () => ({
  default: (await import('../components/AccountList')).AccountList,
}))
const AccountDetail = lazy(async () => ({
  default: (await import('../components/AccountDetail')).AccountDetail,
}))
const AccountForm = lazy(async () => ({
  default: (await import('../components/AccountForm')).AccountForm,
}))

/**
 * Rutas del módulo de Accounts
 * Estas rutas están protegidas y requieren autenticación
 */
export const accountsRoutes: RouteObject[] = [
  {
    path: 'accounts',
    children: [
      {
        index: true,
        element: <AccountList />,
      },
      {
        path: 'new',
        element: <AccountForm />,
      },
      {
        path: ':id',
        element: <AccountDetail />,
      },
      {
        path: ':id/edit',
        element: <AccountForm />,
      },
    ],
  },
]
