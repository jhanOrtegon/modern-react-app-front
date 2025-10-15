import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import { UserAdapter } from '../adapters/UserAdapter'
import type { UserAPIResponse } from '../types/UserAPITypes'

export class JsonPlaceholderUserRepository implements IUserRepository {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com'

  findAll = async (): Promise<User[]> => {
    try {
      const response = await fetch(`${this.baseUrl}/users`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse[]
      return UserAdapter.toDomainList(data)
    } catch (error) {
      throw new Error(
        `Failed to fetch users: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  findById = async (id: number): Promise<User | null> => {
    try {
      const response = await fetch(`${this.baseUrl}/users/${String(id)}`)
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse
      return UserAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw new Error(
        `Failed to fetch user ${String(id)}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  create = async (user: CreateUserDto): Promise<User> => {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserAdapter.toAPICreate(user)),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse
      // JSONPlaceholder doesn't return full user object on create, so we need to create a mock one
      return {
        ...UserAdapter.toDomain(data),
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
    } catch (error) {
      throw new Error(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  update = async (user: UpdateUserDto): Promise<User> => {
    try {
      const response = await fetch(`${this.baseUrl}/users/${String(user.id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(UserAdapter.toAPIUpdate(user)),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse
      return UserAdapter.toDomain(data)
    } catch (error) {
      throw new Error(
        `Failed to update user ${String(user.id)}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  delete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${this.baseUrl}/users/${String(id)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      throw new Error(
        `Failed to delete user ${String(id)}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
