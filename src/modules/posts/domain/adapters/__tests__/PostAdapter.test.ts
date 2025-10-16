import { describe, expect, it } from 'vitest'

import { PostAdapter } from '../PostAdapter'

import type { PostAPIResponse } from '../../../infrastructure/types/PostAPITypes'

describe('PostAdapter', () => {
  describe('toDomain', () => {
    it('debe transformar respuesta del API correctamente con accountId', () => {
      const apiResponse: PostAPIResponse = {
        id: 1,
        userId: 5,
        title: 'Test Post',
        body: 'This is test content',
      }

      const result = PostAdapter.toDomain(apiResponse, 2)

      expect(result).toEqual({
        id: 1,
        accountId: 2,
        userId: 5,
        title: 'Test Post',
        body: 'This is test content',
      })
    })

    it('debe usar accountId=1 por defecto si no se proporciona', () => {
      const apiResponse: PostAPIResponse = {
        id: 1,
        userId: 5,
        title: 'Test Post',
        body: 'This is test content',
      }

      const result = PostAdapter.toDomain(apiResponse)

      expect(result.accountId).toBe(1)
    })

    it('debe aplicar valores por defecto si faltan campos', () => {
      const apiResponse = {
        id: undefined,
        userId: undefined,
        title: null,
        body: null,
      } as unknown as PostAPIResponse

      const result = PostAdapter.toDomain(apiResponse)

      expect(result.id).toBe(0)
      expect(result.userId).toBe(1)
      expect(result.title).toBe('Untitled Post')
      expect(result.body).toBe('')
    })

    it('debe manejar campos undefined correctamente', () => {
      const apiResponse = {} as PostAPIResponse

      const result = PostAdapter.toDomain(apiResponse)

      expect(result).toMatchObject({
        id: 0,
        accountId: 1,
        userId: 1,
        title: 'Untitled Post',
        body: '',
      })
    })

    it('debe preservar todos los campos válidos', () => {
      const apiResponse: PostAPIResponse = {
        id: 999,
        userId: 123,
        title: 'Complete Post',
        body: 'Complete body content',
      }

      const result = PostAdapter.toDomain(apiResponse, 5)

      expect(result.id).toBe(999)
      expect(result.accountId).toBe(5)
      expect(result.userId).toBe(123)
      expect(result.title).toBe('Complete Post')
      expect(result.body).toBe('Complete body content')
    })
  })

  describe('toDomainList', () => {
    it('debe transformar array de respuestas correctamente', () => {
      const apiResponses: PostAPIResponse[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
        { id: 2, userId: 2, title: 'Post 2', body: 'Body 2' },
        { id: 3, userId: 3, title: 'Post 3', body: 'Body 3' },
      ]

      const result = PostAdapter.toDomainList(apiResponses, 10)

      expect(result).toHaveLength(3)
      expect(result[0]).toMatchObject({
        id: 1,
        accountId: 10,
        userId: 1,
        title: 'Post 1',
      })
      expect(result[1]).toMatchObject({
        id: 2,
        accountId: 10,
        userId: 2,
        title: 'Post 2',
      })
      expect(result[2]).toMatchObject({
        id: 3,
        accountId: 10,
        userId: 3,
        title: 'Post 3',
      })
    })

    it('debe retornar array vacío si input no es array', () => {
      const result = PostAdapter.toDomainList(
        null as unknown as PostAPIResponse[]
      )
      expect(result).toEqual([])
    })

    it('debe retornar array vacío si input es undefined', () => {
      const result = PostAdapter.toDomainList(
        undefined as unknown as PostAPIResponse[]
      )
      expect(result).toEqual([])
    })

    it('debe manejar array vacío correctamente', () => {
      const result = PostAdapter.toDomainList([])
      expect(result).toEqual([])
    })

    it('debe aplicar accountId a todos los elementos', () => {
      const apiResponses: PostAPIResponse[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
        { id: 2, userId: 2, title: 'Post 2', body: 'Body 2' },
      ]

      const result = PostAdapter.toDomainList(apiResponses, 99)

      expect(result.every(post => post.accountId === 99)).toBe(true)
    })

    it('debe usar accountId=1 por defecto en todos los elementos', () => {
      const apiResponses: PostAPIResponse[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
        { id: 2, userId: 2, title: 'Post 2', body: 'Body 2' },
      ]

      const result = PostAdapter.toDomainList(apiResponses)

      expect(result.every(post => post.accountId === 1)).toBe(true)
    })
  })

  describe('toAPICreate', () => {
    it('debe transformar CreatePostDto a formato API', () => {
      const dto = {
        accountId: 5,
        userId: 10,
        title: 'New Post',
        body: 'New body',
      }

      const result = PostAdapter.toAPICreate(dto)

      expect(result).toEqual({
        userId: 10,
        title: 'New Post',
        body: 'New body',
      })
    })

    it('debe excluir accountId al transformar a API', () => {
      const dto = {
        accountId: 999,
        userId: 10,
        title: 'Test',
        body: 'Test body',
      }

      const result = PostAdapter.toAPICreate(dto)

      expect(result).not.toHaveProperty('accountId')
      expect(result).not.toHaveProperty('id')
    })
  })

  describe('toAPIUpdate', () => {
    it('debe transformar UpdatePostDto a formato API', () => {
      const dto = {
        id: 1,
        accountId: 5,
        userId: 10,
        title: 'Updated Post',
        body: 'Updated body',
      }

      const result = PostAdapter.toAPIUpdate(dto)

      expect(result).toEqual({
        id: 1,
        userId: 10,
        title: 'Updated Post',
        body: 'Updated body',
      })
    })

    it('debe excluir accountId al transformar a API', () => {
      const dto = {
        id: 1,
        accountId: 999,
        userId: 10,
        title: 'Test',
        body: 'Test body',
      }

      const result = PostAdapter.toAPIUpdate(dto)

      expect(result).not.toHaveProperty('accountId')
    })
  })
})
