import type { Post, UpdatePostDto } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class UpdatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(post: UpdatePostDto): Promise<Post> {
    if (!post.title || post.title.trim() === '') {
      throw new Error('Title is required')
    }
    if (!post.body || post.body.trim() === '') {
      throw new Error('Body is required')
    }
    return await this.postRepository.update(post)
  }
}
