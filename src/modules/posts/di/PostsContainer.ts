import { ClearAllPostsUseCase } from '../application/use-cases/ClearAllPostsUseCase'
import { CreatePostUseCase } from '../application/use-cases/CreatePostUseCase'
import { DeletePostUseCase } from '../application/use-cases/DeletePostUseCase'
import { GetPostsUseCase } from '../application/use-cases/GetPostsUseCase'
import { GetPostUseCase } from '../application/use-cases/GetPostUseCase'
import { UpdatePostUseCase } from '../application/use-cases/UpdatePostUseCase'
import { InMemoryPostRepository } from '../infrastructure/repositories/InMemoryPostRepository'
import { JsonPlaceholderPostRepository } from '../infrastructure/repositories/JsonPlaceholderPostRepository'
import { LocalStoragePostRepository } from '../infrastructure/repositories/LocalStoragePostRepository'

import type { IPostRepository } from '../domain/repositories/IPostRepository'

// Tipos de repositorio disponibles
export type PostRepositoryType = 'jsonplaceholder' | 'localStorage' | 'inMemory'

class PostsContainer {
  private postRepository: IPostRepository | null = null
  private getPostsUseCase: GetPostsUseCase | null = null
  private getPostUseCase: GetPostUseCase | null = null
  private createPostUseCase: CreatePostUseCase | null = null
  private updatePostUseCase: UpdatePostUseCase | null = null
  private deletePostUseCase: DeletePostUseCase | null = null
  private clearAllPostsUseCase: ClearAllPostsUseCase | null = null
  private repositoryType: PostRepositoryType = 'jsonplaceholder' // Por defecto JSONPlaceholder

  /**
   * Cambia el tipo de repositorio y resetea todas las instancias
   * @param type - El tipo de repositorio a usar
   */
  setRepositoryType(type: PostRepositoryType): void {
    if (this.repositoryType !== type) {
      this.repositoryType = type
      // Resetear todas las instancias para que usen el nuevo repositorio
      this.postRepository = null
      this.getPostsUseCase = null
      this.getPostUseCase = null
      this.createPostUseCase = null
      this.updatePostUseCase = null
      this.deletePostUseCase = null
      this.clearAllPostsUseCase = null
    }
  }

  /**
   * Obtiene el tipo de repositorio actual
   */
  getRepositoryType(): PostRepositoryType {
    return this.repositoryType
  }

  getPostRepository(): IPostRepository {
    if (this.postRepository === null) {
      switch (this.repositoryType) {
        case 'localStorage':
          this.postRepository = new LocalStoragePostRepository()
          break
        case 'inMemory':
          this.postRepository = new InMemoryPostRepository()
          break
        case 'jsonplaceholder':
        default:
          this.postRepository = new JsonPlaceholderPostRepository()
          break
      }
    }
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

  getClearAllPostsUseCase(): ClearAllPostsUseCase {
    this.clearAllPostsUseCase ??= new ClearAllPostsUseCase(
      this.getPostRepository()
    )
    return this.clearAllPostsUseCase
  }
}

export const postsContainer = new PostsContainer()
