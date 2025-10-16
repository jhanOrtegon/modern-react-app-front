import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class InMemoryPostRepository implements IPostRepository {
  private posts: Post[] = [
    {
      id: 1,
      userId: 1,
      accountId: 1,
      title: 'Getting Started with React and TypeScript',
      body: 'React with TypeScript provides excellent type safety and developer experience. In this post, we explore best practices for building scalable React applications with TypeScript, including proper typing of components, hooks, and props.',
    },
    {
      id: 2,
      userId: 1,
      accountId: 1,
      title: 'Understanding Clean Architecture',
      body: 'Clean Architecture is a software design philosophy that separates concerns into layers. This approach makes your code more maintainable, testable, and independent of frameworks. We discuss how to implement it in modern web applications.',
    },
    {
      id: 3,
      userId: 2,
      accountId: 1,
      title: 'Modern State Management with TanStack Query',
      body: 'TanStack Query (formerly React Query) revolutionizes how we handle server state in React applications. Learn about caching strategies, optimistic updates, and how to manage complex data fetching scenarios efficiently.',
    },
    {
      id: 4,
      userId: 2,
      accountId: 1,
      title: 'Building Responsive UIs with Tailwind CSS',
      body: 'Tailwind CSS is a utility-first CSS framework that enables rapid UI development. Discover how to create beautiful, responsive interfaces using Tailwind utility classes and custom configurations.',
    },
    {
      id: 5,
      userId: 3,
      accountId: 1,
      title: 'Advanced Form Handling with React Hook Form',
      body: 'React Hook Form provides performant, flexible forms with easy validation. This guide covers advanced patterns like dynamic fields, nested objects, and integration with validation libraries like Zod.',
    },
    {
      id: 6,
      userId: 3,
      accountId: 1,
      title: 'Animations in React with Framer Motion',
      body: 'Framer Motion brings delightful animations to React applications with a simple, declarative API. Learn how to create smooth transitions, gesture-based interactions, and complex animation sequences.',
    },
    {
      id: 7,
      userId: 4,
      accountId: 1,
      title: 'Testing React Applications',
      body: 'Comprehensive testing is crucial for maintaining quality. Explore testing strategies using Jest, React Testing Library, and best practices for writing maintainable test suites that give you confidence.',
    },
    {
      id: 8,
      userId: 4,
      accountId: 1,
      title: 'Performance Optimization in React',
      body: 'Performance matters for user experience. This post covers React performance optimization techniques including memoization, code splitting, lazy loading, and profiling tools to identify bottlenecks.',
    },
    {
      id: 9,
      userId: 5,
      accountId: 1,
      title: 'Implementing Dark Mode',
      body: 'Dark mode is now a standard feature in modern applications. Learn how to implement theme switching using context, CSS variables, and localStorage to persist user preferences across sessions.',
    },
    {
      id: 10,
      userId: 5,
      accountId: 1,
      title: 'Building Accessible Web Applications',
      body: 'Accessibility ensures everyone can use your application. We cover WCAG guidelines, ARIA attributes, keyboard navigation, screen reader support, and testing tools to create inclusive experiences.',
    },
  ]

  private nextId = 11

  findAll = async (_accountId?: number): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    return [...this.posts]
  }

  findById = async (id: number): Promise<Post | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    const post = this.posts.find(p => p.id === id)
    return post ?? null
  }

  create = async (postDto: CreatePostDto): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 400))

    const newPost: Post = {
      id: this.nextId++,
      ...postDto,
    }

    this.posts.push(newPost)
    return newPost
  }

  update = async (postDto: UpdatePostDto): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 400))

    const index = this.posts.findIndex(p => p.id === postDto.id)

    if (index === -1) {
      throw new Error(`Post with id ${String(postDto.id)} not found`)
    }

    const existingPost = this.posts[index]
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

    this.posts[index] = updatedPost
    return updatedPost
  }

  delete = async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300))

    const initialLength = this.posts.length
    this.posts = this.posts.filter(p => p.id !== id)

    if (this.posts.length === initialLength) {
      throw new Error(`Post with id ${String(id)} not found`)
    }
  }
}
