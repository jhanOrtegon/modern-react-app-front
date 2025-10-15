import { Menu } from 'lucide-react'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { ThemeToggle } from '../ui/theme-toggle'

export function AppLayout(): ReactElement {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string): boolean => {
    return location.pathname.startsWith(path)
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
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

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
            </div>
          </nav>
        ) : null}
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
