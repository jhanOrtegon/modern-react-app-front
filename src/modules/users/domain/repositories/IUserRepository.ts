import type { CreateUserDto, UpdateUserDto } from '../dtos'
import type { User } from '../entities/User'

export interface IUserRepository {
  findAll: (accountId?: number) => Promise<User[]>

  findById: (id: number) => Promise<User | null>

  create: (user: CreateUserDto) => Promise<User>

  update: (user: UpdateUserDto) => Promise<User>

  delete: (id: number) => Promise<void>

  clearAll?: (accountId: number) => Promise<void>
}
