import { NetworkError, NotFoundError, RepositoryError } from '@/lib/errors'

import { UserAdapter } from '../adapters/UserAdapter'

import type { CreateUserDto, UpdateUserDto } from '../../domain/dtos'
import type { User } from '../../domain/entities/User'
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import type { UserAPIResponse } from '../types/UserAPITypes'

import { config } from '@/config'

export class JsonPlaceholderUserRepository implements IUserRepository {
  private readonly baseUrl = config.api.baseUrl

  findAll = async (accountId?: number): Promise<User[]> => {
    try {
      const response = await fetch(`${this.baseUrl}/users`)
      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse[]
      // Pasar accountId al adapter para que los usuarios tengan el accountId correcto
      return UserAdapter.toDomainList(data, accountId ?? 1)
    } catch (error) {
      if (error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        'obtener usuarios'
      )
    }
  }

  findById = async (id: number): Promise<User | null> => {
    try {
      const response = await fetch(`${this.baseUrl}/users/${String(id)}`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError('User', id)
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse
      return UserAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null
      }
      if (error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `obtener usuario ${String(id)}`
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
        throw new NetworkError(`HTTP error! status: ${response.status}`)
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
      if (error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        'crear usuario'
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
        if (response.status === 404) {
          throw new NotFoundError('User', user.id)
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
      const data = (await response.json()) as UserAPIResponse
      return UserAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `actualizar usuario ${String(user.id)}`
      )
    }
  }

  delete = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${this.baseUrl}/users/${String(id)}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        if (response.status === 404) {
          throw new NotFoundError('User', id)
        }
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof NetworkError) {
        throw error
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `eliminar usuario ${String(id)}`
      )
    }
  }
}
