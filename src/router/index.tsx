import { Loader2 } from 'lucide-react'
import { lazy, type ReactElement, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '../components/auth/ProtectedRoute'
import { PublicRoute } from '../components/auth/PublicRoute'
import { AppLayout } from '../components/layout/AppLayout'

// Lazy load Auth components
const LoginPage = lazy(async () => ({
  default: (await import('../modules/auth/presentation/pages/LoginPage'))
    .LoginPage,
}))
const RegisterPage = lazy(async () => ({
  default: (await import('../modules/auth/presentation/pages/RegisterPage'))
    .RegisterPage,
}))

// Lazy load Posts components
const PostList = lazy(async () => ({
  default: (await import('../modules/posts/presentation/components/PostList'))
    .PostList,
}))
const PostDetail = lazy(async () => ({
  default: (await import('../modules/posts/presentation/components/PostDetail'))
    .PostDetail,
}))
const PostForm = lazy(async () => ({
  default: (await import('../modules/posts/presentation/components/PostForm'))
    .PostForm,
}))

// Lazy load Users components
const UserList = lazy(async () => ({
  default: (await import('../modules/users/presentation/components/UserList'))
    .UserList,
}))
const UserDetail = lazy(async () => ({
  default: (await import('../modules/users/presentation/components/UserDetail'))
    .UserDetail,
}))
const UserForm = lazy(async () => ({
  default: (await import('../modules/users/presentation/components/UserForm'))
    .UserForm,
}))

// Lazy load Accounts components
const AccountList = lazy(async () => ({
  default: (
    await import('../modules/accounts/presentation/components/AccountList')
  ).AccountList,
}))
const AccountDetail = lazy(async () => ({
  default: (
    await import('../modules/accounts/presentation/components/AccountDetail')
  ).AccountDetail,
}))
const AccountForm = lazy(async () => ({
  default: (
    await import('../modules/accounts/presentation/components/AccountForm')
  ).AccountForm,
}))

// eslint-disable-next-line react-refresh/only-export-components
function LoadingFallback(): ReactElement {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}

export const router = createBrowserRouter([
  // Auth Routes (solo para usuarios no autenticados)
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
  // Protected Routes
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
          // Posts Module Routes
          {
            path: 'posts',
            children: [
              {
                index: true,
                element: <PostList />,
              },
              {
                path: 'new',
                element: <PostForm />,
              },
              {
                path: ':id',
                element: <PostDetail />,
              },
              {
                path: ':id/edit',
                element: <PostForm />,
              },
            ],
          },
          // Users Module Routes
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
          // Accounts Module Routes
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
          {
            path: '*',
            element: <Navigate replace to="/posts" />,
          },
        ],
      },
    ],
  },
])
