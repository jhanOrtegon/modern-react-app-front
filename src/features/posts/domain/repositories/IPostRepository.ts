import type { CreatePostDto, Post, UpdatePostDto } from '../entities/Post'

export interface IPostRepository {
  findAll: () => Promise<Post[]>
  findById: (id: number) => Promise<Post | null>
  create: (post: CreatePostDto) => Promise<Post>
  update: (post: UpdatePostDto) => Promise<Post>
  delete: (id: number) => Promise<void>
  clearAll?: (accountId: number) => Promise<void>
}
