import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class GetPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(): Promise<Post[]> {
    return await this.postRepository.findAll()
  }
}
