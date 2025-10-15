import { CreatePostUseCase } from '../application/use-cases/CreatePostUseCase'
import { DeletePostUseCase } from '../application/use-cases/DeletePostUseCase'
import { GetPostUseCase } from '../application/use-cases/GetPostUseCase'
import { GetPostsUseCase } from '../application/use-cases/GetPostsUseCase'
import { UpdatePostUseCase } from '../application/use-cases/UpdatePostUseCase'
import type { IPostRepository } from '../domain/repositories/IPostRepository'
import { JsonPlaceholderPostRepository } from '../infrastructure/repositories/JsonPlaceholderPostRepository'

class PostsContainer {
  private postRepository: IPostRepository | null = null
  private getPostsUseCase: GetPostsUseCase | null = null
  private getPostUseCase: GetPostUseCase | null = null
  private createPostUseCase: CreatePostUseCase | null = null
  private updatePostUseCase: UpdatePostUseCase | null = null
  private deletePostUseCase: DeletePostUseCase | null = null

  getPostRepository(): IPostRepository {
    this.postRepository ??= new JsonPlaceholderPostRepository()
    return this.postRepository
  }

  getGetPostsUseCase(): GetPostsUseCase {
    this.getPostsUseCase ??= new GetPostsUseCase(this.getPostRepository())
    return this.getPostsUseCase
  }

  getGetPostUseCase(): GetPostUseCase {
    this.getPostUseCase ??= new GetPostUseCase(this.getPostRepository())
    return this.getPostUseCase
  }

  getCreatePostUseCase(): CreatePostUseCase {
    this.createPostUseCase ??= new CreatePostUseCase(this.getPostRepository())
    return this.createPostUseCase
  }

  getUpdatePostUseCase(): UpdatePostUseCase {
    this.updatePostUseCase ??= new UpdatePostUseCase(this.getPostRepository())
    return this.updatePostUseCase
  }

  getDeletePostUseCase(): DeletePostUseCase {
    this.deletePostUseCase ??= new DeletePostUseCase(this.getPostRepository())
    return this.deletePostUseCase
  }
}

export const postsContainer = new PostsContainer()
