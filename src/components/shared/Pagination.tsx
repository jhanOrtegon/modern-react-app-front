import type { ReactElement } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '../ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsPerPage: number
  totalItems: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}: PaginationProps): ReactElement | null {
  // Siempre mostrar la paginación para mantener el espacio consistente
  const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis-1', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(
        1,
        'ellipsis-1',
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      )
    } else {
      pages.push(
        1,
        'ellipsis-1',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        'ellipsis-2',
        totalPages
      )
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-between border-t pt-4">
      {/* Info de items */}
      <div className="text-sm text-muted-foreground">
        Mostrando <span className="font-medium">{startItem}</span> a{' '}
        <span className="font-medium">{endItem}</span> de{' '}
        <span className="font-medium">{totalItems}</span> resultados
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Botón anterior */}
        <Button
          disabled={currentPage === 1 || totalPages <= 1}
          size="sm"
          variant="outline"
          onClick={() => {
            onPageChange(currentPage - 1)
          }}
        >
          <ChevronLeft className="size-4" />
          Anterior
        </Button>

        {/* Números de página - Solo mostrar si hay más de una página */}
        {totalPages > 1 ? (
          <div className="hidden items-center gap-1 sm:flex">
            {pageNumbers.map(page => {
              if (typeof page === 'string' && page.startsWith('ellipsis')) {
                return (
                  <span key={page} className="px-2 text-muted-foreground">
                    ...
                  </span>
                )
              }
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? 'default' : 'outline'}
                  onClick={() => {
                    onPageChange(page as number)
                  }}
                >
                  {page}
                </Button>
              )
            })}
          </div>
        ) : (
          <div className="hidden items-center gap-1 sm:flex">
            <Button disabled size="sm" variant="default">
              1
            </Button>
          </div>
        )}

        {/* Indicador móvil */}
        <div className="flex items-center sm:hidden">
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
        </div>

        {/* Botón siguiente */}
        <Button
          disabled={currentPage === totalPages || totalPages <= 1}
          size="sm"
          variant="outline"
          onClick={() => {
            onPageChange(currentPage + 1)
          }}
        >
          Siguiente
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
