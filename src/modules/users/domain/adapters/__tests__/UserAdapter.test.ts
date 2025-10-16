import { describe, expect, it } from 'vitest'

import { UserAdapter } from '../UserAdapter'

import type { UserAPIResponse } from '../../../infrastructure/types/UserAPITypes'

describe('UserAdapter', () => {
  describe('toDomain', () => {
    it('debe transformar respuesta del API correctamente con accountId', () => {
      const apiResponse: UserAPIResponse = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      }

      const result = UserAdapter.toDomain(apiResponse, 2)

      expect(result).toMatchObject({
        id: 1,
        accountId: 2,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      })
    })

    it('debe usar accountId=1 por defecto si no se proporciona', () => {
      const apiResponse: UserAPIResponse = {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
      }

      const result = UserAdapter.toDomain(apiResponse)

      expect(result.accountId).toBe(1)
    })

    it('debe aplicar valores por defecto si faltan campos', () => {
      const apiResponse = {
        id: undefined,
        name: null,
        username: null,
        email: null,
      } as unknown as UserAPIResponse

      const result = UserAdapter.toDomain(apiResponse)

      expect(result.id).toBe(0)
      expect(result.name).toBe('Unknown User')
      expect(result.username).toBe('anonymous')
      expect(result.email).toBe('no-email@example.com')
    })

    it('debe manejar campos undefined correctamente', () => {
      const apiResponse = {} as UserAPIResponse

      const result = UserAdapter.toDomain(apiResponse)

      expect(result).toMatchObject({
        id: 0,
        accountId: 1,
        name: 'Unknown User',
        username: 'anonymous',
        email: 'no-email@example.com',
      })
    })

    it('debe preservar todos los campos válidos', () => {
      const apiResponse: UserAPIResponse = {
        id: 999,
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
      }

      const result = UserAdapter.toDomain(apiResponse, 5)

      expect(result.id).toBe(999)
      expect(result.accountId).toBe(5)
      expect(result.name).toBe('Jane Smith')
      expect(result.username).toBe('janesmith')
      expect(result.email).toBe('jane@example.com')
    })
  })

  describe('toDomainList', () => {
    it('debe transformar array de respuestas correctamente', () => {
      const apiResponses: UserAPIResponse[] = [
        {
          id: 1,
          name: 'User 1',
          username: 'user1',
          email: 'user1@example.com',
        },
        {
          id: 2,
          name: 'User 2',
          username: 'user2',
          email: 'user2@example.com',
        },
        {
          id: 3,
          name: 'User 3',
          username: 'user3',
          email: 'user3@example.com',
        },
      ]

      const result = UserAdapter.toDomainList(apiResponses, 10)

      expect(result).toHaveLength(3)
      expect(result[0]).toMatchObject({
        id: 1,
        accountId: 10,
        name: 'User 1',
        username: 'user1',
      })
      expect(result[1]).toMatchObject({
        id: 2,
        accountId: 10,
        name: 'User 2',
        username: 'user2',
      })
      expect(result[2]).toMatchObject({
        id: 3,
        accountId: 10,
        name: 'User 3',
        username: 'user3',
      })
    })

    it('debe retornar array vacío si input no es array', () => {
      const result = UserAdapter.toDomainList(
        null as unknown as UserAPIResponse[]
      )
      expect(result).toEqual([])
    })

    it('debe retornar array vacío si input es undefined', () => {
      const result = UserAdapter.toDomainList(
        undefined as unknown as UserAPIResponse[]
      )
      expect(result).toEqual([])
    })

    it('debe manejar array vacío correctamente', () => {
      const result = UserAdapter.toDomainList([])
      expect(result).toEqual([])
    })

    it('debe aplicar accountId a todos los elementos', () => {
      const apiResponses: UserAPIResponse[] = [
        {
          id: 1,
          name: 'User 1',
          username: 'user1',
          email: 'user1@example.com',
        },
        {
          id: 2,
          name: 'User 2',
          username: 'user2',
          email: 'user2@example.com',
        },
      ]

      const result = UserAdapter.toDomainList(apiResponses, 99)

      expect(result.every(user => user.accountId === 99)).toBe(true)
    })

    it('debe usar accountId=1 por defecto en todos los elementos', () => {
      const apiResponses: UserAPIResponse[] = [
        {
          id: 1,
          name: 'User 1',
          username: 'user1',
          email: 'user1@example.com',
        },
        {
          id: 2,
          name: 'User 2',
          username: 'user2',
          email: 'user2@example.com',
        },
      ]

      const result = UserAdapter.toDomainList(apiResponses)

      expect(result.every(user => user.accountId === 1)).toBe(true)
    })
  })

  describe('toAPICreate', () => {
    it('debe transformar CreateUserDto a formato API', () => {
      const dto = {
        accountId: 5,
        name: 'New User',
        username: 'newuser',
        email: 'new@example.com',
        phone: '123-456-7890',
        website: 'https://example.com',
      }

      const result = UserAdapter.toAPICreate(dto)

      expect(result).toEqual({
        name: 'New User',
        username: 'newuser',
        email: 'new@example.com',
        phone: '123-456-7890',
        website: 'https://example.com',
      })
    })

    it('debe excluir accountId al transformar a API', () => {
      const dto = {
        accountId: 999,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '000-000-0000',
        website: 'https://test.com',
      }

      const result = UserAdapter.toAPICreate(dto)

      expect(result).not.toHaveProperty('accountId')
      expect(result).not.toHaveProperty('id')
    })
  })

  describe('toAPIUpdate', () => {
    it('debe transformar UpdateUserDto a formato API', () => {
      const dto = {
        id: 1,
        accountId: 5,
        name: 'Updated User',
        username: 'updateduser',
        email: 'updated@example.com',
        phone: '999-999-9999',
        website: 'https://updated.com',
      }

      const result = UserAdapter.toAPIUpdate(dto)

      expect(result).toEqual({
        id: 1,
        name: 'Updated User',
        username: 'updateduser',
        email: 'updated@example.com',
        phone: '999-999-9999',
        website: 'https://updated.com',
      })
    })

    it('debe excluir accountId al transformar a API', () => {
      const dto = {
        id: 1,
        accountId: 999,
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        phone: '000-000-0000',
        website: 'https://test.com',
      }

      const result = UserAdapter.toAPIUpdate(dto)

      expect(result).not.toHaveProperty('accountId')
    })
  })
})
