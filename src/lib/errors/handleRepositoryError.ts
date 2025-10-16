import {
  DomainError,
  NetworkError,
  NotFoundError,
  RepositoryError,
} from './DomainError'

export function handleRepositoryError(error: unknown, context: string): never {
  if (error instanceof DomainError) {
    throw error
  }

  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase()

    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      throw new NotFoundError(context, 'desconocido')
    }

    if (
      errorMessage.includes('network') ||
      errorMessage.includes('fetch') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('connection')
    ) {
      throw new NetworkError(
        `Error de conexión al ${context}. Verifica tu internet.`
      )
    }

    if (errorMessage.includes('500') || errorMessage.includes('503')) {
      throw new RepositoryError(
        `El servidor no está disponible para ${context}`,
        context
      )
    }

    throw new RepositoryError(error.message, context)
  }

  throw new RepositoryError(`Error desconocido al ${context}`, context)
}
