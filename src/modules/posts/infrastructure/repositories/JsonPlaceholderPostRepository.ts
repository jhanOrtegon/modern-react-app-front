import { NetworkError, NotFoundError, RepositoryError } from '@/lib/errors'

import { PostAdapter } from '../../domain/adapters/PostAdapter'

import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'
import type { PostAPIResponse } from '../types/PostAPITypes'

import { config } from '@/config'

export class JsonPlaceholderPostRepository implements IPostRepository {
  private readonly baseUrl = config.api.baseUrl

  findAll = async (accountId?: number): Promise<Post[]> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts`)
      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse[]
      // Pasar accountId al adapter para que los posts tengan el accountId correcto
      return PostAdapter.toDomainList(data, accountId ?? 1)
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        'obtener posts'
      )
    }
  }

  findById = async (id: number): Promise<Post | null> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${String(id)}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError('Post', id)
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse
      return PostAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      if (error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `obtener post ${String(id)}`
      )
    }
  }

  create = async (post: CreatePostDto): Promise<Post> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PostAdapter.toAPICreate(post)),
      })
      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse
      return PostAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        'crear post'
      )
    }
  }

  update = async (post: UpdatePostDto): Promise<Post> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${String(post.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(PostAdapter.toAPIUpdate(post)),
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError('Post', post.id)
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse
      return PostAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `actualizar post ${String(post.id)}`
      )
    }
  }

  delete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${String(id)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError('Post', id)
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `eliminar post ${String(id)}`
      )
    }
  }
}
