import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class ClearAllPostsUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(accountId: number): Promise<void> {
    if (this.postRepository.clearAll) {
      await this.postRepository.clearAll(accountId)
    } else {
      throw new Error('Clear all operation not supported by this repository')
    }
  }
}
