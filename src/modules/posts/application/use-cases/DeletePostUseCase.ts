import { handleRepositoryError } from '@/lib/errors'
import { logger } from '@/lib/logger'

import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class DeletePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(id: number): Promise<void> {
    try {
      logger.info('Deleting post', {
        module: 'posts',
        postId: id,
      })

      await this.postRepository.delete(id)

      logger.info('Post deleted successfully', {
        module: 'posts',
        postId: id,
      })
    } catch (error) {
      logger.error('Error deleting post', error as Error, {
        module: 'posts',
        postId: id,
      })
      handleRepositoryError(error, 'eliminar post')
      throw error
    }
  }
}
