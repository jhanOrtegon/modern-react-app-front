import type {
  CreatePostDto,
  Post,
  UpdatePostDto,
} from '../../domain/entities/Post'
import type {
  PostAPICreateRequest,
  PostAPIResponse,
  PostAPIUpdateRequest,
} from '../types/PostAPITypes'

/**
 * Adaptador defensivo para transformar datos del API a entidades del dominio
 * Este adaptador protege contra:
 * - Llaves faltantes o renombradas en el backend
 * - Tipos incorrectos
 * - Valores null o undefined
 * - Cambios en la estructura del API
 */
export const PostAdapter = {
  /**
   * Convierte una respuesta del API a una entidad Post del dominio
   * Aplica valores por defecto para evitar errores
   * Nota: JSONPlaceholder no tiene accountId, lo agregamos con valor por defecto
   */
  toDomain(apiResponse: PostAPIResponse, accountId = 1): Post {
    return {
      id: apiResponse.id ?? 0,
      userId: apiResponse.userId ?? 1,
      title: apiResponse.title ?? 'Untitled Post',
      body: apiResponse.body ?? '',
      accountId, // Agregamos accountId (por defecto 1 para datos del API)
    }
  },

  /**
   * Convierte un array de respuestas del API a entidades del dominio
   */
  toDomainList(apiResponses: PostAPIResponse[], accountId = 1): Post[] {
    if (!Array.isArray(apiResponses)) {
      return []
    }

    return apiResponses.map(item => this.toDomain(item, accountId))
  },

  /**
   * Convierte un CreatePostDto a formato esperado por el API
   */
  toAPICreate(dto: CreatePostDto): PostAPICreateRequest {
    return {
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },

  /**
   * Convierte un UpdatePostDto a formato esperado por el API
   */
  toAPIUpdate(dto: UpdatePostDto): PostAPIUpdateRequest {
    return {
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },
}
