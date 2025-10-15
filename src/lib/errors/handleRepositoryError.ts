import {
  DomainError,
  NetworkError,
  NotFoundError,
  RepositoryError,
} from './DomainError'

/**
 * Maneja errores de repositorios y los transforma en errores de dominio
 * @param error - Error original capturado
 * @param context - Contexto de la operación (ej: "obtener usuarios")
 * @throws {DomainError} Error transformado del dominio
 */
export function handleRepositoryError(error: unknown, context: string): never {
  // Si ya es un error de dominio, re-lanzarlo
  if (error instanceof DomainError) {
    throw error
  }

  // Si es un Error estándar, analizarlo
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase()

    // Error 404 - Recurso no encontrado
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      throw new NotFoundError(context, 'desconocido')
    }

    // Error de red
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

    // Error de servidor (5xx)
    if (errorMessage.includes('500') || errorMessage.includes('503')) {
      throw new RepositoryError(
        `El servidor no está disponible para ${context}`,
        context
      )
    }

    // Error genérico del repositorio
    throw new RepositoryError(error.message, context)
  }

  // Error completamente desconocido
  throw new RepositoryError(`Error desconocido al ${context}`, context)
}
