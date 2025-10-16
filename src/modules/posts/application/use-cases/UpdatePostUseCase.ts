import { handleRepositoryError } from '@/lib/errors'
import { logger } from '@/lib/logger'

import { PostValidator } from '../../domain/validators/PostValidator'

import type { UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class UpdatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(post: UpdatePostDto): Promise<Post> {
    try {
      // Validar con PostValidator
      PostValidator.validate(post)

      logger.info('Updating post', {
        module: 'posts',
        postId: post.id,
      })

      const updatedPost = await this.postRepository.update(post)

      logger.info('Post updated successfully', {
        module: 'posts',
        postId: updatedPost.id,
      })

      return updatedPost
    } catch (error) {
      logger.error('Error updating post', error as Error, {
        module: 'posts',
        postId: post.id,
      })
      handleRepositoryError(error, 'actualizar post')
      throw error
    }
  }
}
