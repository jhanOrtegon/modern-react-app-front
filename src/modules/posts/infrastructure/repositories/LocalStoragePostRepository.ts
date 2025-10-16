import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

const STORAGE_KEY = 'posts_storage'

export class LocalStoragePostRepository implements IPostRepository {
  private getPosts(): Post[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data === null) {
        return []
      }
      return JSON.parse(data) as Post[]
    } catch {
      return []
    }
  }

  private savePosts(posts: Post[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    } catch (error) {
      throw new Error(
        `Failed to save to localStorage: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  private generateId(): number {
    const posts = this.getPosts()
    if (posts.length === 0) {
      return 1
    }
    return Math.max(...posts.map(p => p.id)) + 1
  }

  findAll = async (): Promise<Post[]> => {
    const allPosts = this.getPosts()
    return await Promise.resolve(allPosts)
  }

  findById = async (id: number): Promise<Post | null> => {
    const posts = this.getPosts()
    const post = posts.find(p => p.id === id)
    return await Promise.resolve(post ?? null)
  }

  create = async (postDto: CreatePostDto): Promise<Post> => {
    const posts = this.getPosts()
    const newPost: Post = {
      id: this.generateId(),
      ...postDto,
    }
    posts.push(newPost)
    this.savePosts(posts)
    return await Promise.resolve(newPost)
  }

  update = async (postDto: UpdatePostDto): Promise<Post> => {
    const posts = this.getPosts()
    const index = posts.findIndex(p => p.id === postDto.id)

    if (index === -1) {
      throw new Error(`Post with id ${String(postDto.id)} not found`)
    }

    const existingPost = posts[index]
    if (existingPost === undefined) {
      throw new Error(`Post with id ${String(postDto.id)} not found`)
    }

    const updatedPost: Post = {
      id: existingPost.id,
      title: postDto.title,
      body: postDto.body,
      userId: postDto.userId,
      accountId: postDto.accountId,
    }

    posts[index] = updatedPost
    this.savePosts(posts)
    return await Promise.resolve(updatedPost)
  }

  delete = async (id: number): Promise<void> => {
    const posts = this.getPosts()
    const filteredPosts = posts.filter(p => p.id !== id)

    if (posts.length === filteredPosts.length) {
      throw new Error(`Post with id ${String(id)} not found`)
    }

    this.savePosts(filteredPosts)
    await Promise.resolve()
  }

  clearAll = async (accountId: number): Promise<void> => {
    try {
      const posts = this.getPosts()
      // Filtrar y mantener solo los posts que NO pertenecen a la cuenta especificada
      const filteredPosts = posts.filter(p => p.accountId !== accountId)
      this.savePosts(filteredPosts)
      await Promise.resolve()
    } catch (error) {
      throw new Error(
        `Failed to clear posts: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }
}
