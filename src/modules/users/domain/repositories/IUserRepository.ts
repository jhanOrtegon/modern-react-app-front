import type { CreateUserDto, UpdateUserDto } from '../dtos'
import type { User } from '../entities/User'

/**
 * Interfaz del repositorio de Users
 *
 * Define el contrato para todas las implementaciones de repositorios de usuarios
 * (API externa, LocalStorage, InMemory, etc.)
 *
 * @remarks
 * Esta interfaz sigue el patrón Repository y el principio de Inversión de Dependencias.
 * El dominio define la interfaz y la infraestructura la implementa.
 *
 * @example
 * ```typescript
 * const repository: IUserRepository = new JsonPlaceholderUserRepository()
 * const users = await repository.findAll()
 * ```
 */
export interface IUserRepository {
  /**
   * Obtiene todos los usuarios
   * @returns Promise con array de usuarios
   * @throws {RepositoryError} Si falla la operación
   */
  findAll: () => Promise<User[]>

  /**
   * Busca un usuario por su ID
   * @param id - ID del usuario a buscar
   * @returns Promise con el usuario o null si no existe
   * @throws {RepositoryError} Si falla la operación
   */
  findById: (id: number) => Promise<User | null>

  /**
   * Crea un nuevo usuario
   * @param user - Datos del usuario a crear
   * @returns Promise con el usuario creado (incluye ID asignado)
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {RepositoryError} Si falla la operación
   */
  create: (user: CreateUserDto) => Promise<User>

  /**
   * Actualiza un usuario existente
   * @param user - Datos del usuario a actualizar (debe incluir ID)
   * @returns Promise con el usuario actualizado
   * @throws {NotFoundError} Si el usuario no existe
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {RepositoryError} Si falla la operación
   */
  update: (user: UpdateUserDto) => Promise<User>

  /**
   * Elimina un usuario por su ID
   * @param id - ID del usuario a eliminar
   * @returns Promise void
   * @throws {NotFoundError} Si el usuario no existe
   * @throws {RepositoryError} Si falla la operación
   */
  delete: (id: number) => Promise<void>

  /**
   * Elimina todos los usuarios de una cuenta (opcional)
   * @param accountId - ID de la cuenta
   * @returns Promise void
   * @throws {RepositoryError} Si falla la operación
   */
  clearAll?: (accountId: number) => Promise<void>
}
