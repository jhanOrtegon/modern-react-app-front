import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'

const STORAGE_KEY = 'users_storage'

export class LocalStorageUserRepository implements IUserRepository {
  private getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data === null) {
        return []
      }
      return JSON.parse(data) as User[]
    } catch {
      return []
    }
  }

  private saveUsers(users: User[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      throw new Error(
        `Failed to save to localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private generateId(): number {
    const users = this.getUsers()
    if (users.length === 0) {
      return 1
    }
    return Math.max(...users.map(u => u.id)) + 1
  }

  findAll = async (): Promise<User[]> => {
    // Simulate async operation
    return await Promise.resolve(this.getUsers())
  }

  findById = async (id: number): Promise<User | null> => {
    const users = this.getUsers()
    const user = users.find(u => u.id === id)
    return await Promise.resolve(user ?? null)
  }

  create = async (userDto: CreateUserDto): Promise<User> => {
    const users = this.getUsers()
    const newUser: User = {
      id: this.generateId(),
      ...userDto,
      accountId: userDto.accountId,
      address: {
        street: 'N/A',
        suite: 'N/A',
        city: 'N/A',
        zipcode: 'N/A',
      },
      company: {
        name: 'N/A',
        catchPhrase: 'N/A',
        bs: 'N/A',
      },
    }
    users.push(newUser)
    this.saveUsers(users)
    return await Promise.resolve(newUser)
  }

  update = async (userDto: UpdateUserDto): Promise<User> => {
    const users = this.getUsers()
    const index = users.findIndex(u => u.id === userDto.id)

    if (index === -1) {
      throw new Error(`User with id ${String(userDto.id)} not found`)
    }

    const existingUser = users[index]
    if (existingUser === undefined) {
      throw new Error(`User with id ${String(userDto.id)} not found`)
    }

    const updatedUser: User = {
      id: existingUser.id,
      name: userDto.name,
      username: userDto.username,
      email: userDto.email,
      phone: userDto.phone,
      website: userDto.website,
      accountId: userDto.accountId,
      address: existingUser.address,
      company: existingUser.company,
    }

    users[index] = updatedUser
    this.saveUsers(users)
    return await Promise.resolve(updatedUser)
  }

  delete = async (id: number): Promise<void> => {
    const users = this.getUsers()
    const filteredUsers = users.filter(u => u.id !== id)

    if (users.length === filteredUsers.length) {
      throw new Error(`User with id ${String(id)} not found`)
    }

    this.saveUsers(filteredUsers)
    await Promise.resolve()
  }

  clearAll = async (accountId: number): Promise<void> => {
    try {
      const users = this.getUsers()
      // Filtrar y mantener solo los usuarios que NO pertenecen a la cuenta especificada
      const filteredUsers = users.filter(u => u.accountId !== accountId)
      this.saveUsers(filteredUsers)
      await Promise.resolve()
    } catch (error) {
      throw new Error(
        `Failed to clear users: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
