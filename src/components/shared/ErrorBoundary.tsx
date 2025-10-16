import { Component, type ErrorInfo, type ReactNode } from 'react'

import { AlertCircle, Home, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { logger } from '@/lib/logger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('Error capturado por ErrorBoundary:', error, {
      componentStack: errorInfo.componentStack,
    })

    this.setState({
      errorInfo,
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  handleReload = (): void => {
    window.location.reload()
  }

  handleGoHome = (): void => {
    window.location.href = '/'
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            {}
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="size-12 text-destructive" />
              </div>
            </div>

            {}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">
                ¡Oops! Algo salió mal
              </h1>
              <p className="text-muted-foreground">
                La aplicación encontró un error inesperado. Por favor, intenta
                recargar la página.
              </p>
            </div>

            {}
            {this.state.error ? (
              <details className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-left">
                <summary className="cursor-pointer font-medium text-destructive">
                  Detalles del error (desarrollo)
                </summary>
                <div className="mt-3 space-y-2 text-sm">
                  <p className="font-mono text-xs">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo ? (
                    <pre className="overflow-auto rounded bg-muted p-2 text-xs">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  ) : null}
                </div>
              </details>
            ) : null}

            {}
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button className="gap-2" onClick={this.handleReload}>
                <RefreshCw className="size-4" />
                Recargar página
              </Button>
              <Button
                className="gap-2"
                variant="outline"
                onClick={this.handleGoHome}
              >
                <Home className="size-4" />
                Ir al inicio
              </Button>
            </div>

            {}
            <p className="text-xs text-muted-foreground">
              Si el problema persiste, por favor contacta al soporte técnico.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
