import type { CreateUserDto, UpdateUserDto, User } from '../entities/User'

export interface IUserRepository {
  findAll: () => Promise<User[]>
  findById: (id: number) => Promise<User | null>
  create: (user: CreateUserDto) => Promise<User>
  update: (user: UpdateUserDto) => Promise<User>
  delete: (id: number) => Promise<void>
  clearAll?: (accountId: number) => Promise<void>
}
