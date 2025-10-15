import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class GetPostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<Post | null> {
    return await this.postRepository.findById(id)
  }
}
