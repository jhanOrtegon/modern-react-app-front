import { ClearAllUsersUseCase } from '../application/use-cases/ClearAllUsersUseCase'
import { CreateUserUseCase } from '../application/use-cases/CreateUserUseCase'
import { DeleteUserUseCase } from '../application/use-cases/DeleteUserUseCase'
import { GetUserUseCase } from '../application/use-cases/GetUserUseCase'
import { GetUsersUseCase } from '../application/use-cases/GetUsersUseCase'
import { UpdateUserUseCase } from '../application/use-cases/UpdateUserUseCase'
import type { IUserRepository } from '../domain/repositories/IUserRepository'
import { InMemoryUserRepository } from '../infrastructure/repositories/InMemoryUserRepository'
import { JsonPlaceholderUserRepository } from '../infrastructure/repositories/JsonPlaceholderUserRepository'
import { LocalStorageUserRepository } from '../infrastructure/repositories/LocalStorageUserRepository'

// Tipos de repositorio disponibles
export type UserRepositoryType = 'jsonplaceholder' | 'localStorage' | 'inMemory'

class UsersContainer {
  private userRepository: IUserRepository | null = null
  private getUsersUseCase: GetUsersUseCase | null = null
  private getUserUseCase: GetUserUseCase | null = null
  private createUserUseCase: CreateUserUseCase | null = null
  private updateUserUseCase: UpdateUserUseCase | null = null
  private deleteUserUseCase: DeleteUserUseCase | null = null
  private clearAllUsersUseCase: ClearAllUsersUseCase | null = null
  private repositoryType: UserRepositoryType = 'jsonplaceholder' // Por defecto JSONPlaceholder

  /**
   * Cambia el tipo de repositorio y resetea todas las instancias
   * @param type - El tipo de repositorio a usar
   */
  setRepositoryType(type: UserRepositoryType): void {
    if (this.repositoryType !== type) {
      this.repositoryType = type
      // Resetear todas las instancias para que usen el nuevo repositorio
      this.userRepository = null
      this.getUsersUseCase = null
      this.getUserUseCase = null
      this.createUserUseCase = null
      this.updateUserUseCase = null
      this.deleteUserUseCase = null
      this.clearAllUsersUseCase = null
    }
  }

  /**
   * Obtiene el tipo de repositorio actual
   */
  getRepositoryType(): UserRepositoryType {
    return this.repositoryType
  }

  getUserRepository(): IUserRepository {
    if (this.userRepository === null) {
      switch (this.repositoryType) {
        case 'localStorage':
          this.userRepository = new LocalStorageUserRepository()
          break
        case 'inMemory':
          this.userRepository = new InMemoryUserRepository()
          break
        case 'jsonplaceholder':
        default:
          this.userRepository = new JsonPlaceholderUserRepository()
          break
      }
    }
    return this.userRepository
  }

  getGetUsersUseCase(): GetUsersUseCase {
    this.getUsersUseCase ??= new GetUsersUseCase(this.getUserRepository())
    return this.getUsersUseCase
  }

  getGetUserUseCase(): GetUserUseCase {
    this.getUserUseCase ??= new GetUserUseCase(this.getUserRepository())
    return this.getUserUseCase
  }

  getCreateUserUseCase(): CreateUserUseCase {
    this.createUserUseCase ??= new CreateUserUseCase(this.getUserRepository())
    return this.createUserUseCase
  }

  getUpdateUserUseCase(): UpdateUserUseCase {
    this.updateUserUseCase ??= new UpdateUserUseCase(this.getUserRepository())
    return this.updateUserUseCase
  }

  getDeleteUserUseCase(): DeleteUserUseCase {
    this.deleteUserUseCase ??= new DeleteUserUseCase(this.getUserRepository())
    return this.deleteUserUseCase
  }

  getClearAllUsersUseCase(): ClearAllUsersUseCase {
    this.clearAllUsersUseCase ??= new ClearAllUsersUseCase(
      this.getUserRepository()
    )
    return this.clearAllUsersUseCase
  }
}

export const usersContainer = new UsersContainer()
