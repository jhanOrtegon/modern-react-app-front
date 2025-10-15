import type { ReactElement } from 'react'

import { ArrowLeft, Edit, Mail, Trash2, User } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { FadeIn } from '@/components/shared/FadeIn'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'

import { useAccount, useDeleteAccount } from '../hooks/useAccountOperations'

export function AccountDetail(): ReactElement {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const accountId = id ? Number.parseInt(id, 10) : undefined

  const { data: account, isLoading } = useAccount(accountId)
  const deleteAccount = useDeleteAccount()

  const handleDelete = (): void => {
    // eslint-disable-next-line no-alert
    if (window.confirm('¿Estás seguro de que quieres eliminar esta cuenta?')) {
      if (accountId) {
        deleteAccount.mutate(accountId, {
          onSuccess: () => {
            navigate('/accounts')
          },
        })
      }
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!account) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Cuenta no encontrada</p>
        <Button asChild className="mt-4" variant="outline">
          <Link to="/accounts">
            <ArrowLeft className="mr-2 size-4" />
            Volver a cuentas
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <FadeIn>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button asChild size="sm" variant="ghost">
            <Link to="/accounts">
              <ArrowLeft className="mr-2 size-4" />
              Volver
            </Link>
          </Button>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link to={`/accounts/${account.id}/edit`}>
                <Edit className="mr-2 size-4" />
                Editar
              </Link>
            </Button>
            <Button
              disabled={deleteAccount.isPending}
              size="sm"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 size-4" />
              Eliminar
            </Button>
          </div>
        </div>

        {/* Account Card */}
        <div className="overflow-hidden rounded-lg border bg-card">
          <div className="border-b bg-muted/50 p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <User className="size-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{account.name}</h1>
                <p className="text-sm text-muted-foreground">
                  ID: {account.id}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-6">
            {/* Email */}
            <div>
              <div className="mb-2 flex items-center text-sm font-medium text-muted-foreground">
                <Mail className="mr-2 size-4" />
                Email
              </div>
              <p className="text-lg">{account.email}</p>
            </div>

            {/* Created At */}
            {account.createdAt ? (
              <div>
                <div className="mb-2 block text-sm font-medium text-muted-foreground">
                  Fecha de Creación
                </div>
                <p className="text-lg">
                  {new Date(account.createdAt).toLocaleString()}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </FadeIn>
  )
}
