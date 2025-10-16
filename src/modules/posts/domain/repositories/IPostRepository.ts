import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'

/**
 * Interfaz del repositorio de Posts
 *
 * Define el contrato para todas las implementaciones de repositorios de posts
 * (API externa, LocalStorage, InMemory, etc.)
 *
 * @remarks
 * Esta interfaz sigue el patrón Repository y el principio de Inversión de Dependencias.
 * El dominio define la interfaz y la infraestructura la implementa.
 *
 * @example
 * ```typescript
 * const repository: IPostRepository = new JsonPlaceholderPostRepository()
 * const posts = await repository.findAll()
 * ```
 */
export interface IPostRepository {
  /**
   * Obtiene todos los posts
   * @returns Promise con array de posts
   * @throws {RepositoryError} Si falla la operación
   */
  findAll: () => Promise<Post[]>

  /**
   * Busca un post por su ID
   * @param id - ID del post a buscar
   * @returns Promise con el post o null si no existe
   * @throws {RepositoryError} Si falla la operación
   */
  findById: (id: number) => Promise<Post | null>

  /**
   * Crea un nuevo post
   * @param post - Datos del post a crear
   * @returns Promise con el post creado (incluye ID asignado)
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {RepositoryError} Si falla la operación
   */
  create: (post: CreatePostDto) => Promise<Post>

  /**
   * Actualiza un post existente
   * @param post - Datos del post a actualizar (debe incluir ID)
   * @returns Promise con el post actualizado
   * @throws {NotFoundError} Si el post no existe
   * @throws {ValidationError} Si los datos no son válidos
   * @throws {RepositoryError} Si falla la operación
   */
  update: (post: UpdatePostDto) => Promise<Post>

  /**
   * Elimina un post por su ID
   * @param id - ID del post a eliminar
   * @returns Promise void
   * @throws {NotFoundError} Si el post no existe
   * @throws {RepositoryError} Si falla la operación
   */
  delete: (id: number) => Promise<void>

  /**
   * Elimina todos los posts de una cuenta (opcional)
   * @param accountId - ID de la cuenta
   * @returns Promise void
   * @throws {RepositoryError} Si falla la operación
   */
  clearAll?: (accountId: number) => Promise<void>
}
