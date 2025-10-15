import type { ReactElement } from 'react'
import { useState } from 'react'

import { Database, LogOut, Menu, User } from 'lucide-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { useAuthStore } from '@/modules/auth/infrastructure/stores'

import { useClearAllPosts } from '../../modules/posts/presentation/hooks/usePostOperations'
import { useClearAllUsers } from '../../modules/users/presentation/hooks/useUserOperations'
import { useRepositoryStore } from '../../stores/repositoryStore'
import { RepositorySelector } from '../shared/RepositorySelector'
import { Button } from '../ui/button'
import { ThemeToggle } from '../ui/theme-toggle'

export function AppLayout(): ReactElement {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Auth store
  const account = useAuthStore(state => state.account)
  const logout = useAuthStore(state => state.logout)

  // Usar Zustand store para el estado de visibilidad del selector
  const isSelectorVisible = useRepositoryStore(state => state.isSelectorVisible)
  const toggleSelectorVisibility = useRepositoryStore(
    state => state.toggleSelectorVisibility
  )

  // Mutations para limpiar datos
  const clearAllPostsMutation = useClearAllPosts()
  const clearAllUsersMutation = useClearAllUsers()

  const handleLogout = (): void => {
    logout()
    toast.success('Sesión cerrada', {
      description: 'Has cerrado sesión correctamente',
    })
    navigate('/login')
  }

  const isActive = (path: string): boolean => {
    return location.pathname.startsWith(path)
  }

  // Verificar si estamos en una ruta de listado (no detalle ni formulario)
  const isListRoute = (): boolean => {
    return location.pathname === '/posts' || location.pathname === '/users'
  }

  // Determinar el tipo de ruta actual
  const getCurrentModule = ():
    | { type: 'posts'; label: string; createPath: string }
    | { type: 'users'; label: string; createPath: string }
    | null => {
    if (location.pathname === '/posts') {
      return { type: 'posts', label: 'Nuevo Post', createPath: '/posts/new' }
    }
    if (location.pathname === '/users') {
      return { type: 'users', label: 'Nuevo Usuario', createPath: '/users/new' }
    }
    return null
  }

  const currentModule = getCurrentModule()
  const showRepositorySelector = isListRoute()

  const handleClearAll = (): void => {
    if (!currentModule) {
      return
    }

    const mutation =
      currentModule.type === 'posts'
        ? clearAllPostsMutation
        : clearAllUsersMutation

    mutation.mutate(undefined, {
      onSuccess: () => {
        setShowConfirmDialog(false)
      },
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link className="flex items-center gap-2" to="/">
              <h1 className="text-xl font-bold">Modern App</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/posts') ? 'text-primary' : 'text-muted-foreground'
                }`}
                to="/posts"
              >
                Posts
              </Link>
              <Link
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/users') ? 'text-primary' : 'text-muted-foreground'
                }`}
                to="/users"
              >
                Users
              </Link>
              <Link
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/accounts')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                to="/accounts"
              >
                Accounts
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* User Info */}
            <div className="hidden items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 md:flex">
              <User className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">{account?.name}</span>
            </div>

            {/* Repository Selector Toggle - Solo visible en rutas de listado */}
            {showRepositorySelector ? (
              <Button
                size="icon"
                title="Repository Settings"
                variant="ghost"
                onClick={toggleSelectorVisibility}
              >
                <Database className="size-5" />
              </Button>
            ) : null}

            <ThemeToggle />

            {/* Logout Button */}
            <Button
              size="icon"
              title="Cerrar Sesión"
              variant="ghost"
              onClick={handleLogout}
            >
              <LogOut className="size-5" />
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              type="button"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
              }}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen ? (
          <nav className="border-t bg-card p-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link
                className={`text-sm font-medium ${
                  isActive('/posts') ? 'text-primary' : 'text-muted-foreground'
                }`}
                to="/posts"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                Posts
              </Link>
              <Link
                className={`text-sm font-medium ${
                  isActive('/users') ? 'text-primary' : 'text-muted-foreground'
                }`}
                to="/users"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                Users
              </Link>
              <Link
                className={`text-sm font-medium ${
                  isActive('/accounts')
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                to="/accounts"
                onClick={() => {
                  setIsMenuOpen(false)
                }}
              >
                Accounts
              </Link>
            </div>
          </nav>
        ) : null}
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <div
          className={`grid gap-6 ${showRepositorySelector ? 'lg:grid-cols-[1fr_350px]' : ''}`}
        >
          {/* Main Content Area */}
          <div className="min-h-0">
            <Outlet />
          </div>

          {/* Repository Selector Sidebar - Solo en rutas de listado */}
          {isSelectorVisible && showRepositorySelector ? (
            <div className="lg:sticky lg:top-[10.4rem] lg:self-start">
              {/* Diálogo de confirmación */}
              {showConfirmDialog ? (
                <div className="mb-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                  <h3 className="mb-2 font-semibold text-destructive">
                    ¿Estás seguro?
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Esta acción eliminará todos los{' '}
                    {currentModule?.type === 'posts' ? 'posts' : 'usuarios'} del
                    almacenamiento local. No se puede deshacer.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      disabled={
                        currentModule?.type === 'posts'
                          ? clearAllPostsMutation.isPending
                          : clearAllUsersMutation.isPending
                      }
                      size="sm"
                      variant="destructive"
                      onClick={handleClearAll}
                    >
                      Sí, eliminar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowConfirmDialog(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : null}

              {/* Repository Selector */}
              <div className="pr-2">
                <RepositorySelector />
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}
