import type { ReactElement, ReactNode } from 'react'

import { Database, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../ui/button'

interface EmptyStateProps {
  /**
   * Título del mensaje vacío
   */
  title: string

  /**
   * Descripción del mensaje vacío
   */
  description?: string

  /**
   * Ícono personalizado (opcional)
   */
  icon?: ReactNode

  /**
   * Ruta para el botón de acción
   */
  actionLink?: string

  /**
   * Texto del botón de acción
   */
  actionLabel?: string
}

/**
 * Componente EmptyState
 *
 * Muestra un estado vacío con ícono, mensaje y opcionalmente un botón de acción.
 * Se usa cuando no hay datos que mostrar en listas o tablas.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No posts found"
 *   description="Create your first post to get started"
 *   actionLink="/posts/new"
 *   actionLabel="Create Post"
 * />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon,
  actionLink,
  actionLabel,
}: EmptyStateProps): ReactElement {
  return (
    <div className="flex h-[600px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/10 p-8 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
        {icon ?? <Database className="size-8 text-muted-foreground" />}
      </div>

      <h3 className="mb-2 text-xl font-semibold">{title}</h3>

      {description ? (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}

      {actionLink && actionLabel ? (
        <Button asChild>
          <Link to={actionLink}>
            <Plus className="mr-2 size-4" />
            {actionLabel}
          </Link>
        </Button>
      ) : null}
    </div>
  )
}
