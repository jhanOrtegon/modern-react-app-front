/**
 * Error base del dominio
 * Todos los errores de la aplicación deberían extender de esta clase
 */
export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode = 400
  ) {
    super(message)
    this.name = 'DomainError'
    Object.setPrototypeOf(this, DomainError.prototype)
  }
}

/**
 * Error cuando un recurso no es encontrado
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, id: string | number) {
    super(`${resource} con id ${id} no encontrado`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}

/**
 * Error de validación de datos
 */
export class ValidationError extends DomainError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    Object.setPrototypeOf(this, ValidationError.prototype)
  }
}

/**
 * Error de autenticación/autorización
 */
export class UnauthorizedError extends DomainError {
  constructor(message = 'No autorizado') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}

/**
 * Error de red/conectividad
 */
export class NetworkError extends DomainError {
  constructor(message = 'Error de conexión. Verifica tu internet.') {
    super(message, 'NETWORK_ERROR', 503)
    this.name = 'NetworkError'
    Object.setPrototypeOf(this, NetworkError.prototype)
  }
}

/**
 * Error en operaciones de repositorio
 */
export class RepositoryError extends DomainError {
  constructor(message: string, operation: string) {
    super(`Error en ${operation}: ${message}`, 'REPOSITORY_ERROR', 500)
    this.name = 'RepositoryError'
    Object.setPrototypeOf(this, RepositoryError.prototype)
  }
}
