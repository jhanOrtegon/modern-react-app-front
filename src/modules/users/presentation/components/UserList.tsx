import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'

import { Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { AnimatedCard } from '@/components/shared/AnimatedCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { PageTransition } from '@/components/shared/PageTransition'
import { Pagination } from '@/components/shared/Pagination'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/shared/StaggerContainer'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { useClearAllUsers, useUsers } from '../hooks/useUserOperations'

const ITEMS_PER_PAGE = 9

export function UserList(): ReactElement {
  const { data: users, isLoading, error } = useUsers()
  const clearAllMutation = useClearAllUsers()
  const [showConfirmPopover, setShowConfirmPopover] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { paginatedUsers, totalPages } = useMemo(() => {
    if (!users) {
      return { paginatedUsers: [], totalPages: 0 }
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return {
      paginatedUsers: users.slice(startIndex, endIndex),
      totalPages: Math.ceil(users.length / ITEMS_PER_PAGE),
    }
  }, [users, currentPage])

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
    return <LoadingSpinner text="Loading users..." />
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
        <p className="text-destructive">Error: {error.message}</p>
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Users</h1>
          </div>

          <EmptyState
            actionLabel="Create First User"
            actionLink="/users/new"
            description="There are no users in the selected repository. Create your first user to get started."
            title="No users found"
          />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Users</h1>
          <div className="flex flex-wrap gap-2">
            {users.length > 0 ? (
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
                      Esta acción eliminará todos los usuarios del
                      almacenamiento local. No se puede deshacer.
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
              <Link to="/users/new">
                <Plus className="mr-2 size-4" />
                Nuevo Usuario
              </Link>
            </Button>
          </div>
        </div>

        <StaggerContainer className="grid min-h-[652px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedUsers.map((user, index) => (
            <StaggerItem key={user.id}>
              <AnimatedCard delay={index * 0.05}>
                <Link
                  className="block h-full rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
                  to={`/users/${String(user.id)}`}
                >
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                    {user.name}
                  </h3>
                  <p className="line-clamp-1 text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                  <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                    {user.email}
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground">
                    <p className="line-clamp-1">{user.company.name}</p>
                    <p className="line-clamp-1 italic">
                      {user.company.catchPhrase}
                    </p>
                  </div>
                </Link>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {}
        {users.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={users.length}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>
    </PageTransition>
  )
}
