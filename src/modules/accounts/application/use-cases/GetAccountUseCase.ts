import type { Account } from '../../domain/entities/Account'
import type { IAccountRepository } from '../../domain/repositories/IAccountRepository'

/**
 * Use Case para obtener una cuenta por ID
 */
export class GetAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(id: number): Promise<Account | null> {
    return await this.accountRepository.findById(id)
  }
}
