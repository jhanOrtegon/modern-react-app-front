export interface Post {
  id: number
  title: string
  body: string
  userId: number
}

export interface CreatePostDto {
  title: string
  body: string
  userId: number
}

export interface UpdatePostDto {
  id: number
  title: string
  body: string
  userId: number
}
