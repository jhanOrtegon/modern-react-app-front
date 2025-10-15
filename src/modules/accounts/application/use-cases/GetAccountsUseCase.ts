import type { Account } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

/**
 * Use Case para obtener todas las cuentas
 */
export class GetAccountsUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(): Promise<Account[]> {
    return await this.accountRepository.findAll()
  }
}
