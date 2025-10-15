import type { ReactElement } from 'react'
import { useState } from 'react'

import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PageTransition } from '@/components/shared/PageTransition'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { useLoginLogic } from '../hooks/useLoginLogic'

export function LoginForm(): ReactElement {
  const { form, onSubmit, isPending } = useLoginLogic()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    void form.handleSubmit(onSubmit)(e)
  }

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <LogIn className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <input
                {...form.register('email')}
                className={`w-full rounded-md border bg-background px-3 py-2 ${form.formState.errors.email ? 'border-destructive focus:ring-destructive' : ''}`}
                id="email"
                placeholder="tu@email.com"
                type="email"
              />
              {form.formState.errors.email ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <input
                  {...form.register('password')}
                  className={`w-full rounded-md border bg-background px-3 py-2 pr-10 ${form.formState.errors.password ? 'border-destructive focus:ring-destructive' : ''}`}
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  type="button"
                  onClick={() => {
                    setShowPassword(!showPassword)
                  }}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
                </p>
              ) : null}
            </div>

            <Button
              className="w-full"
              disabled={isPending}
              size="lg"
              type="submit"
            >
              {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿No tienes cuenta? </span>
              <Link
                className="font-medium text-primary hover:underline"
                to="/register"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
