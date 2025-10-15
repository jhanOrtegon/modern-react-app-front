import { PostAdapter } from '../adapters/PostAdapter'

import type {
  CreatePostDto,
  Post,
  UpdatePostDto,
} from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'
import type { PostAPIResponse } from '../types/PostAPITypes'

export class JsonPlaceholderPostRepository implements IPostRepository {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com'

  findAll = async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse[]
      return PostAdapter.toDomainList(data)
    } catch (error) {
      throw new Error(
        `Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  findById = async (id: number): Promise<Post | null> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${String(id)}`)
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse
      return PostAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw new Error(
        `Failed to fetch post ${String(id)}: ${error instanceof Error ? error.message : 'Unknown error'}`
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse
      return PostAdapter.toDomain(data)
    } catch (error) {
      throw new Error(
        `Failed to create post: ${error instanceof Error ? error.message : 'Unknown error'}`
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
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as PostAPIResponse
      return PostAdapter.toDomain(data)
    } catch (error) {
      throw new Error(
        `Failed to update post ${String(post.id)}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  delete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${String(id)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      throw new Error(
        `Failed to delete post ${String(id)}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
