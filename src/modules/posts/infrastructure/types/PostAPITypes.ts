/**
 * Tipos que representan la estructura de datos del API externo (JSONPlaceholder)
 * Estos tipos definen el contrato con el backend
 */

export interface PostAPIResponse {
  id?: number
  userId?: number
  title?: string
  body?: string
}

export interface PostAPICreateRequest {
  userId: number
  title: string
  body: string
}

export interface PostAPIUpdateRequest {
  id: number
  userId: number
  title: string
  body: string
}
