/**
 * Barrel export para el sistema de errores
 */
export {
  DomainError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  NetworkError,
  RepositoryError,
} from './DomainError'

export { handleRepositoryError } from './handleRepositoryError'
