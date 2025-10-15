import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'
import type {
  UserAPICreateRequest,
  UserAPIResponse,
  UserAPIUpdateRequest,
} from '../types/UserAPITypes'

/**
 * Adaptador defensivo para transformar datos del API a entidades del dominio
 * Este adaptador protege contra:
 * - Llaves faltantes o renombradas en el backend
 * - Tipos incorrectos
 * - Valores null o undefined
 * - Cambios en la estructura del API
 */
export const UserAdapter = {
  /**
   * Convierte una respuesta del API a una entidad User del dominio
   * Aplica valores por defecto para evitar errores
   */
  toDomain(apiResponse: UserAPIResponse): User {
    return {
      id: apiResponse.id ?? 0,
      name: apiResponse.name ?? 'Unknown User',
      username: apiResponse.username ?? 'anonymous',
      email: apiResponse.email ?? 'no-email@example.com',
      phone: apiResponse.phone ?? 'N/A',
      website: apiResponse.website ?? 'N/A',
      address: {
        street: apiResponse.address?.street ?? 'N/A',
        suite: apiResponse.address?.suite ?? 'N/A',
        city: apiResponse.address?.city ?? 'N/A',
        zipcode: apiResponse.address?.zipcode ?? 'N/A',
      },
      company: {
        name: apiResponse.company?.name ?? 'N/A',
        catchPhrase: apiResponse.company?.catchPhrase ?? 'N/A',
        bs: apiResponse.company?.bs ?? 'N/A',
      },
    }
  },

  /**
   * Convierte un array de respuestas del API a entidades del dominio
   */
  toDomainList(apiResponses: UserAPIResponse[]): User[] {
    if (!Array.isArray(apiResponses)) {
      return []
    }

    return apiResponses.map(item => this.toDomain(item))
  },

  /**
   * Convierte un CreateUserDto a formato esperado por el API
   */
  toAPICreate(dto: CreateUserDto): UserAPICreateRequest {
    return {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
    }
  },

  /**
   * Convierte un UpdateUserDto a formato esperado por el API
   */
  toAPIUpdate(dto: UpdateUserDto): UserAPIUpdateRequest {
    return {
      id: dto.id,
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
    }
  },
}
