export interface Post {
  id: number
  title: string
  body: string
  userId: number
  accountId: number // ID de la cuenta propietaria
}

export interface CreatePostDto {
  title: string
  body: string
  userId: number
  accountId: number
}

export interface UpdatePostDto {
  id: number
  title: string
  body: string
  userId: number
  accountId: number
}
