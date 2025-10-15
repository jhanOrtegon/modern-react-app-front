import { Plus, Trash2 } from 'lucide-react'
import type { ReactElement } from 'react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatedCard } from '../../../../components/shared/AnimatedCard'
import { EmptyState } from '../../../../components/shared/EmptyState'
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner'
import { PageTransition } from '../../../../components/shared/PageTransition'
import { Pagination } from '../../../../components/shared/Pagination'
import {
  StaggerContainer,
  StaggerItem,
} from '../../../../components/shared/StaggerContainer'
import { Button } from '../../../../components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../../components/ui/popover'
import { useClearAllPosts, usePosts } from '../hooks/usePostOperations'

const ITEMS_PER_PAGE = 9

export function PostList(): ReactElement {
  const { data: posts, isLoading, error } = usePosts()
  const clearAllMutation = useClearAllPosts()
  const [showConfirmPopover, setShowConfirmPopover] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Calcular items paginados
  const { paginatedPosts, totalPages } = useMemo(() => {
    if (!posts) {
      return { paginatedPosts: [], totalPages: 0 }
    }

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE

    return {
      paginatedPosts: posts.slice(startIndex, endIndex),
      totalPages: Math.ceil(posts.length / ITEMS_PER_PAGE),
    }
  }, [posts, currentPage])

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
    return <LoadingSpinner text="Loading posts..." />
  }

  if (error) {
    return (
      <PageTransition>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-center">
          <p className="text-destructive">Error: {error.message}</p>
        </div>
      </PageTransition>
    )
  }

  // Verificar si no hay datos
  if (!posts || posts.length === 0) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Posts</h1>
          </div>

          <EmptyState
            actionLabel="Create First Post"
            actionLink="/posts/new"
            description="There are no posts in the selected repository. Create your first post to get started."
            title="No posts found"
          />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Posts</h1>
          <div className="flex flex-wrap gap-2">
            {posts.length > 0 ? (
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
                      Esta acción eliminará todos los posts del almacenamiento
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
              <Link to="/posts/new">
                <Plus className="mr-2 size-4" />
                Nuevo Post
              </Link>
            </Button>
          </div>
        </div>

        <StaggerContainer className="grid min-h-[652px] gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedPosts.map((post, index) => (
            <StaggerItem key={post.id}>
              <AnimatedCard delay={index * 0.05}>
                <Link
                  className="block h-full rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
                  to={`/posts/${String(post.id)}`}
                >
                  <h3 className="mb-2 line-clamp-2 text-lg font-semibold">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {post.body}
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    User ID: {post.userId}
                  </p>
                </Link>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Paginación */}
        {posts.length > 0 ? (
          <Pagination
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={posts.length}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>
    </PageTransition>
  )
}
