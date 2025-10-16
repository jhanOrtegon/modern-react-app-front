import type { ReactElement, ReactNode } from 'react'

import { Database, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../ui/button'

interface EmptyStateProps {
  title: string

  description?: string

  icon?: ReactNode

  actionLink?: string

  actionLabel?: string
}

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
