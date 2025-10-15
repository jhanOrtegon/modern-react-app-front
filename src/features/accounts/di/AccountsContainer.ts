import { ClearAllAccountsUseCase } from '../application/use-cases/ClearAllAccountsUseCase'
import { CreateAccountUseCase } from '../application/use-cases/CreateAccountUseCase'
import { DeleteAccountUseCase } from '../application/use-cases/DeleteAccountUseCase'
import { GetAccountsUseCase } from '../application/use-cases/GetAccountsUseCase'
import { GetAccountUseCase } from '../application/use-cases/GetAccountUseCase'
import { UpdateAccountUseCase } from '../application/use-cases/UpdateAccountUseCase'
import type { IAccountRepository } from '../domain/repositories/IAccountRepository'
import { LocalStorageAccountRepository } from '../infrastructure/repositories/LocalStorageAccountRepository'

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
