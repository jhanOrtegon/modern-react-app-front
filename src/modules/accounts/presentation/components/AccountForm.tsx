import type { ReactElement } from 'react'

import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { FadeIn } from '@/components/shared/FadeIn'
import { FormField } from '@/components/shared/FormField'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

import { useAccountFormLogic } from '../hooks/useAccountFormLogic'

export function AccountForm(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const accountId = id ? Number.parseInt(id, 10) : undefined

  const { form, onSubmit, isPending, isLoadingAccount, isEditing, backLink } =
    useAccountFormLogic(accountId)

  if (isLoadingAccount) {
    return <LoadingSpinner />
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-2xl space-y-6">
        {}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? 'Editar Cuenta' : 'Nueva Cuenta'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? 'Actualiza la información de la cuenta'
                : 'Completa los datos para crear una nueva cuenta'}
            </p>
          </div>
          <Button asChild size="sm" variant="ghost">
            <Link to={backLink}>
              <ArrowLeft className="mr-2 size-4" />
              Cancelar
            </Link>
          </Button>
        </div>

        {}
        <form
          className="space-y-6 rounded-lg border bg-card p-6"
          onSubmit={e => {
            void form.handleSubmit(onSubmit)(e)
          }}
        >
          {}
          <FormField
            required
            error={form.formState.errors.name?.message}
            htmlFor="name"
            label="Nombre"
          >
            <input
              {...form.register('name')}
              className={`w-full rounded-md border bg-background px-3 py-2 ${
                form.formState.errors.name
                  ? 'border-destructive focus:ring-destructive'
                  : ''
              }`}
              id="name"
              placeholder="Nombre de la cuenta"
              type="text"
            />
          </FormField>

          {}
          <FormField
            required
            error={form.formState.errors.email?.message}
            htmlFor="email"
            label="Email"
          >
            <input
              {...form.register('email')}
              className={`w-full rounded-md border bg-background px-3 py-2 ${
                form.formState.errors.email
                  ? 'border-destructive focus:ring-destructive'
                  : ''
              }`}
              id="email"
              placeholder="correo@ejemplo.com"
              type="email"
            />
          </FormField>

          {}
          {form.formState.errors.root ? (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          ) : null}

          {}
          <div className="flex justify-end gap-3">
            <Button asChild type="button" variant="outline">
              <Link to={backLink}>Cancelar</Link>
            </Button>
            <Button disabled={isPending} type="submit">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 size-4" />
                  {isEditing ? 'Actualizar' : 'Crear'} Cuenta
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </FadeIn>
  )
}
