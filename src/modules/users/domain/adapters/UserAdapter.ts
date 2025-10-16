import type {
  UserAPICreateRequest,
  UserAPIResponse,
  UserAPIUpdateRequest,
} from '../../infrastructure/types/UserAPITypes'
import type { CreateUserDto, UpdateUserDto } from '../dtos'
import type { User } from '../entities/User'

export const UserAdapter = {
  toDomain(apiResponse: UserAPIResponse, accountId = 1): User {
    return {
      id: apiResponse.id ?? 0,
      name: apiResponse.name ?? 'Unknown User',
      username: apiResponse.username ?? 'anonymous',
      email: apiResponse.email ?? 'no-email@example.com',
      phone: apiResponse.phone ?? 'N/A',
      website: apiResponse.website ?? 'N/A',
      accountId,
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

  toDomainList(apiResponses: UserAPIResponse[], accountId = 1): User[] {
    if (!Array.isArray(apiResponses)) {
      return []
    }

    return apiResponses.map(item => this.toDomain(item, accountId))
  },

  toAPICreate(dto: CreateUserDto): UserAPICreateRequest {
    return {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
    }
  },

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
