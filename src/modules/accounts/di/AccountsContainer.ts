import { ClearAllAccountsUseCase } from '../application/use-cases/ClearAllAccountsUseCase'
import { CreateAccountUseCase } from '../application/use-cases/CreateAccountUseCase'
import { DeleteAccountUseCase } from '../application/use-cases/DeleteAccountUseCase'
import { GetAccountsUseCase } from '../application/use-cases/GetAccountsUseCase'
import { GetAccountUseCase } from '../application/use-cases/GetAccountUseCase'
import { UpdateAccountUseCase } from '../application/use-cases/UpdateAccountUseCase'
import { LocalStorageAccountRepository } from '../infrastructure/repositories/LocalStorageAccountRepository'

import type { IAccountRepository } from '../domain/repositories/IAccountRepository'

/**
 * Tipos de repositorio disponibles para Accounts
 */
export type AccountRepositoryType = 'localStorage'

/**
 * Dependency Injection Container para el módulo de Accounts
 * Implementa el patrón Singleton con inicialización perezosa
 */
class AccountsContainer {
  private accountRepository?: IAccountRepository
  private getAccountsUseCase?: GetAccountsUseCase
  private getAccountUseCase?: GetAccountUseCase
  private createAccountUseCase?: CreateAccountUseCase
  private updateAccountUseCase?: UpdateAccountUseCase
  private deleteAccountUseCase?: DeleteAccountUseCase
  private clearAllAccountsUseCase?: ClearAllAccountsUseCase
  private repositoryType: AccountRepositoryType = 'localStorage'

  /**
   * Cambia el tipo de repositorio y resetea todas las instancias
   * @param type - El tipo de repositorio a usar
   */
  setRepositoryType(type: AccountRepositoryType): void {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (this.repositoryType !== type) {
      this.repositoryType = type
      // Resetear todas las instancias para que usen el nuevo repositorio
      this.accountRepository = undefined
      this.getAccountsUseCase = undefined
      this.getAccountUseCase = undefined
      this.createAccountUseCase = undefined
      this.updateAccountUseCase = undefined
      this.deleteAccountUseCase = undefined
      this.clearAllAccountsUseCase = undefined
    }
  }

  /**
   * Obtiene el tipo de repositorio actual
   */
  getRepositoryType(): AccountRepositoryType {
    return this.repositoryType
  }

  // Repository
  getAccountRepository(): IAccountRepository {
    this.accountRepository ??= new LocalStorageAccountRepository()
    return this.accountRepository
  }

  // Use Cases
  getGetAccountsUseCase(): GetAccountsUseCase {
    this.getAccountsUseCase ??= new GetAccountsUseCase(
      this.getAccountRepository()
    )
    return this.getAccountsUseCase
  }

  getGetAccountUseCase(): GetAccountUseCase {
    this.getAccountUseCase ??= new GetAccountUseCase(
      this.getAccountRepository()
    )
    return this.getAccountUseCase
  }

  getCreateAccountUseCase(): CreateAccountUseCase {
    this.createAccountUseCase ??= new CreateAccountUseCase(
      this.getAccountRepository()
    )
    return this.createAccountUseCase
  }

  getUpdateAccountUseCase(): UpdateAccountUseCase {
    this.updateAccountUseCase ??= new UpdateAccountUseCase(
      this.getAccountRepository()
    )
    return this.updateAccountUseCase
  }

  getDeleteAccountUseCase(): DeleteAccountUseCase {
    this.deleteAccountUseCase ??= new DeleteAccountUseCase(
      this.getAccountRepository()
    )
    return this.deleteAccountUseCase
  }

  getClearAllAccountsUseCase(): ClearAllAccountsUseCase {
    this.clearAllAccountsUseCase ??= new ClearAllAccountsUseCase(
      this.getAccountRepository()
    )
    return this.clearAllAccountsUseCase
  }
}

// Singleton instance
export const accountsContainer = new AccountsContainer()
