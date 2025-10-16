import type { ReactElement } from 'react'
import { useState } from 'react'

import { Bug } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ErrorBoundaryTest(): ReactElement {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
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
