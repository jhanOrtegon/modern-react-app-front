import { handleRepositoryError } from '@/lib/errors'
import { logger } from '@/lib/logger'

import { PostValidator } from '../../domain/validators/PostValidator'

import type { CreatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class CreatePostUseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(post: CreatePostDto): Promise<Post> {
    try {
      PostValidator.validate(post)

      logger.info('Creating post', {
        module: 'posts',
        userId: post.userId,
        accountId: post.accountId,
      })

      const createdPost = await this.postRepository.create(post)

      logger.info('Post created successfully', {
        module: 'posts',
        postId: createdPost.id,
      })

      return createdPost
    } catch (error) {
      logger.error('Error creating post', error as Error, {
        module: 'posts',
        userId: post.userId,
      })
      handleRepositoryError(error, 'crear post')
      throw error
    }
  }
}
