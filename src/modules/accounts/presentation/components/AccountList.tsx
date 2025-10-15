import { Mail, Plus, Trash2, User } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedCard } from '../../../../components/shared/AnimatedCard'
import { EmptyState } from '../../../../components/shared/EmptyState'
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner'
import { Pagination } from '../../../../components/shared/Pagination'
import { StaggerContainer } from '../../../../components/shared/StaggerContainer'
import { Button } from '../../../../components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover'
import { useAccounts, useClearAllAccounts } from '../hooks/useAccountOperations'

const ITEMS_PER_PAGE = 9

export function AccountList(): ReactElement {
  const { data: accounts, isLoading } = useAccounts()
  const clearAllMutation = useClearAllAccounts()
  const [showConfirmPopover, setShowConfirmPopover] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Calcular items paginados
  const { paginatedAccounts, totalPages } = useMemo(() => {
    if (!accounts) {
      return { paginatedAccounts: [], totalPages: 0 }
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return {
      paginatedAccounts: accounts.slice(startIndex, endIndex),
      totalPages: Math.ceil(accounts.length / ITEMS_PER_PAGE),
    }
  }, [accounts, currentPage])

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearAll = (): void => {
    clearAllMutation.mutate(undefined, {
      onSuccess: () => {
        setShowConfirmPopover(false)
        setCurrentPage(1)
      },
    })
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (!accounts || accounts.length === 0) {
    return (
      <EmptyState
        description="No hay cuentas registradas en el sistema"
        title="No hay cuentas"
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cuentas</h1>
          <p className="text-muted-foreground">
            Gestiona las cuentas del sistema
          </p>
        </div>
        <div className="flex gap-2">
          {accounts.length > 0 ? (
            <Popover
              open={showConfirmPopover}
              onOpenChange={setShowConfirmPopover}
            >
              <PopoverTrigger asChild>
                <Button
                  disabled={clearAllMutation.isPending}
                  size="lg"
                  variant="destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Eliminar
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80" side="bottom">
                <div className="space-y-3">
                  <h3 className="font-semibold text-destructive">
                    ¿Estás seguro?
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Esta acción eliminará todas las cuentas del almacenamiento
                    local. No se puede deshacer.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      disabled={clearAllMutation.isPending}
                      size="sm"
                      variant="destructive"
                      onClick={handleClearAll}
                    >
                      Sí, eliminar
                    </Button>
                    <Button
                      disabled={clearAllMutation.isPending}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowConfirmPopover(false)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : null}
          <Button asChild size="lg">
            <Link to="/accounts/new">
              <Plus className="mr-2 size-4" />
              Nueva Cuenta
            </Link>
          </Button>
        </div>
      </div>

      <StaggerContainer className="grid min-h-[652px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedAccounts.map((account, index) => (
          <AnimatedCard key={account.id} delay={index * 0.05}>
            <Link
              className="block h-full rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
              to={`/accounts/${account.id}`}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="size-6 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">
                  ID: {account.id}
                </span>
              </div>

              <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                {account.name}
              </h3>

              <div className="flex items-center text-sm text-muted-foreground">
                <Mail className="mr-2 size-4" />
                <span className="line-clamp-1">{account.email}</span>
              </div>

              {account.createdAt ? (
                <div className="mt-3 text-xs text-muted-foreground">
                  Creada: {new Date(account.createdAt).toLocaleDateString()}
                </div>
              ) : null}
            </Link>
          </AnimatedCard>
        ))}
      </StaggerContainer>

      {/* Paginación */}
      {accounts.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={ITEMS_PER_PAGE}
          totalItems={accounts.length}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : null}
    </div>
  )
}
