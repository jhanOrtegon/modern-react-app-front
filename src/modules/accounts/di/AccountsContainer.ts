import { ClearAllAccountsUseCase } from '../application/use-cases/ClearAllAccountsUseCase'
import { CreateAccountUseCase } from '../application/use-cases/CreateAccountUseCase'
import { DeleteAccountUseCase } from '../application/use-cases/DeleteAccountUseCase'
import { GetAccountsUseCase } from '../application/use-cases/GetAccountsUseCase'
import { GetAccountUseCase } from '../application/use-cases/GetAccountUseCase'
import { UpdateAccountUseCase } from '../application/use-cases/UpdateAccountUseCase'
import { LocalStorageAccountRepository } from '../infrastructure/repositories/LocalStorageAccountRepository'

import type { IAccountRepository } from '../domain/repositories/IAccountRepository'

export type AccountRepositoryType = 'localStorage'

class AccountsContainer {
  private accountRepository?: IAccountRepository
  private getAccountsUseCase?: GetAccountsUseCase
  private getAccountUseCase?: GetAccountUseCase
  private createAccountUseCase?: CreateAccountUseCase
  private updateAccountUseCase?: UpdateAccountUseCase
  private deleteAccountUseCase?: DeleteAccountUseCase
  private clearAllAccountsUseCase?: ClearAllAccountsUseCase
  private repositoryType: AccountRepositoryType = 'localStorage'

  setRepositoryType(type: AccountRepositoryType): void {
    this.repositoryType = type

    this.accountRepository = undefined
    this.getAccountsUseCase = undefined
    this.getAccountUseCase = undefined
    this.createAccountUseCase = undefined
    this.updateAccountUseCase = undefined
    this.deleteAccountUseCase = undefined
    this.clearAllAccountsUseCase = undefined
  }

  getRepositoryType(): AccountRepositoryType {
    return this.repositoryType
  }

  getAccountRepository(): IAccountRepository {
    this.accountRepository ??= new LocalStorageAccountRepository()
    return this.accountRepository
  }

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

export const accountsContainer = new AccountsContainer()
