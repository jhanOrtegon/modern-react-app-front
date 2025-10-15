import { Eye, EyeOff, UserPlus } from 'lucide-react'
import type { ReactElement } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTransition } from '../../../../components/shared/PageTransition'
import { Button } from '../../../../components/ui/button'
import { Label } from '../../../../components/ui/label'
import { useRegisterLogic } from '../hooks/useRegisterLogic'

export function RegisterForm(): ReactElement {
  const { form, onSubmit, isPending } = useRegisterLogic()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    void form.handleSubmit(onSubmit)(e)
  }

  return (
    <PageTransition>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center py-8">
        <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
              <UserPlus className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Crear Cuenta</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Completa los datos para registrarte
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <input
                {...form.register('name')}
                className={`w-full rounded-md border bg-background px-3 py-2 ${form.formState.errors.name ? 'border-destructive focus:ring-destructive' : ''}`}
                id="name"
                placeholder="Juan Pérez"
                type="text"
              />
              {form.formState.errors.name ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <div className="relative">
                <input
                  {...form.register('confirmPassword')}
                  className={`w-full rounded-md border bg-background px-3 py-2 pr-10 ${form.formState.errors.confirmPassword ? 'border-destructive focus:ring-destructive' : ''}`}
                  id="confirmPassword"
                  placeholder="••••••••"
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  type="button"
                  onClick={() => {
                    setShowConfirmPassword(!showConfirmPassword)
                  }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {form.formState.errors.confirmPassword ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.confirmPassword.message}
                </p>
              ) : null}
            </div>

            <Button
              className="w-full"
              disabled={isPending}
              size="lg"
              type="submit"
            >
              {isPending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link
                className="font-medium text-primary hover:underline"
                to="/login"
              >
                Inicia Sesión
              </Link>
            </div>
          </form>
        </div>
      </div>
    </PageTransition>
  )
}
