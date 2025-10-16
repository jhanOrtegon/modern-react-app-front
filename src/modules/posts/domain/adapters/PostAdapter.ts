import type {
  PostAPICreateRequest,
  PostAPIResponse,
  PostAPIUpdateRequest,
} from '../../infrastructure/types/PostAPITypes'
import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'

export const PostAdapter = {
  toDomain(apiResponse: PostAPIResponse, accountId = 1): Post {
    return {
      id: apiResponse.id ?? 0,
      userId: apiResponse.userId ?? 1,
      title: apiResponse.title ?? 'Untitled Post',
      body: apiResponse.body ?? '',
      accountId,
    }
  },

  toDomainList(apiResponses: PostAPIResponse[], accountId = 1): Post[] {
    if (!Array.isArray(apiResponses)) {
      return []
    }

    return apiResponses.map(item => this.toDomain(item, accountId))
  },

  toAPICreate(dto: CreatePostDto): PostAPICreateRequest {
    return {
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },

  toAPIUpdate(dto: UpdatePostDto): PostAPIUpdateRequest {
    return {
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },
}
