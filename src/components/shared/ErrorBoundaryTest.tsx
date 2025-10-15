import type { ReactElement } from 'react'
import { useState } from 'react'

import { Bug } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Componente de prueba para ErrorBoundary
 *
 * Este componente es solo para testing en desarrollo.
 * Lanza un error cuando se hace clic en el botón para verificar
 * que el ErrorBoundary funciona correctamente.
 *
 * IMPORTANTE: Remover o comentar en producción
 *
 * @example
 * ```tsx
 * // En cualquier página de desarrollo
 * import { ErrorBoundaryTest } from '@/components/shared/ErrorBoundaryTest'
 *
 * <ErrorBoundaryTest />
 * ```
 */
export function ErrorBoundaryTest(): ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    // Esto lanzará un error que será capturado por ErrorBoundary
    throw new Error(
      '🧪 Error de prueba lanzado intencionalmente desde ErrorBoundaryTest'
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        className="gap-2 shadow-lg"
        size="sm"
        variant="destructive"
        onClick={() => {
          setShouldThrow(true)
        }}
      >
        <Bug className="size-4" />
        Probar ErrorBoundary
      </Button>
    </div>
  )
}
