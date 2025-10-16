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
