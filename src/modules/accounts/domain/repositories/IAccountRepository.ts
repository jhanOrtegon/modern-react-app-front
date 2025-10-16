import type { CreateAccountDto, UpdateAccountDto } from '../dtos'
import type { Account } from '../entities/Account'

/**
 * Interface del repositorio de cuentas
 * Define el contrato para todas las implementaciones
 */
export interface IAccountRepository {
  findAll: () => Promise<Account[]>
  findById: (id: number) => Promise<Account | null>
  create: (account: CreateAccountDto) => Promise<Account>
  update: (account: UpdateAccountDto) => Promise<Account>
  delete: (id: number) => Promise<void>
  clearAll?: () => Promise<void>
}
