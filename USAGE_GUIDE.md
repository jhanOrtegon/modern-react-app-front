# 💡 Guía Práctica de Uso - Nuevas Utilidades

## 🎯 Cómo Usar las Implementaciones

Esta guía muestra ejemplos prácticos de cómo usar todas las nuevas utilidades implementadas.

---

## 1. 🛡️ ErrorBoundary

### Uso Básico (Ya implementado)

```tsx
// src/main.tsx
import { ErrorBoundary } from './components/shared/ErrorBoundary'

;<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Uso con Callback Personalizado

```tsx
import * as Sentry from '@sentry/react'

;<ErrorBoundary
  onError={(error, errorInfo) => {
    // Enviar a servicio de logging
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } },
    })
  }}
>
  <App />
</ErrorBoundary>
```

### Uso con UI Personalizada

```tsx
<ErrorBoundary
  fallback={
    <div className="custom-error">
      <h1>Algo salió mal</h1>
      <button onClick={() => window.location.reload()}>Reintentar</button>
    </div>
  }
>
  <ComponenteRiesgoso />
</ErrorBoundary>
```

### Probar el ErrorBoundary

```tsx
// src/App.tsx
import { ErrorBoundaryTest } from './components/shared/ErrorBoundaryTest'

function App() {
  return (
    <>
      {/* Tu app */}
      {/* Solo para desarrollo */}
      {import.meta.env.DEV && <ErrorBoundaryTest />}
    </>
  )
}
```

---

## 2. ✔️ Validadores de Dominio

### En Use Cases (Ya implementado)

```typescript
// src/modules/posts/application/use-cases/CreatePostUseCase.ts
import { PostValidator } from '../../domain/entities/Post'

export class CreatePostUseCase {
  async execute(dto: CreatePostDto): Promise<Post> {
    // Validar antes de cualquier operación
    PostValidator.validate(dto)

    return await this.repository.create(dto)
  }
}
```

### Validación Individual de Campos

```typescript
import { PostValidator } from '@/modules/posts/domain/entities/Post'

// Validar solo el título
try {
  PostValidator.validateTitle(title)
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.message) // "El título no puede estar vacío"
    console.log(error.field) // "title"
  }
}

// Validar solo el body
try {
  PostValidator.validateBody(body)
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(error.message) // "El cuerpo no puede estar vacío"
  }
}
```

### Crear Validadores Personalizados

```typescript
// src/modules/comments/domain/entities/Comment.ts
import { ValidationError } from '@/lib/errors'

export class CommentValidator {
  static validate(comment: CreateCommentDto): void {
    this.validateContent(comment.content)
    this.validatePostId(comment.postId)
  }

  static validateContent(content: string): void {
    const trimmed = content.trim()
    if (!trimmed) {
      throw new ValidationError('El comentario no puede estar vacío', 'content')
    }
    if (trimmed.length < 3) {
      throw new ValidationError(
        'El comentario debe tener al menos 3 caracteres',
        'content'
      )
    }
    if (trimmed.length > 1000) {
      throw new ValidationError(
        'El comentario no puede superar 1000 caracteres',
        'content'
      )
    }
  }

  static validatePostId(postId: number): void {
    if (!Number.isInteger(postId) || postId <= 0) {
      throw new ValidationError(
        'El ID del post debe ser un número positivo',
        'postId'
      )
    }
  }
}
```

---

## 3. 📊 Logger Centralizado

### En Use Cases (Ya implementado)

```typescript
import { logger } from '@/lib/logger'

export class CreatePostUseCase {
  async execute(dto: CreatePostDto): Promise<Post> {
    try {
      // Log de inicio
      logger.info('Creating post', {
        module: 'posts',
        userId: dto.userId,
        accountId: dto.accountId,
      })

      const post = await this.repository.create(dto)

      // Log de éxito
      logger.info('Post created successfully', {
        module: 'posts',
        postId: post.id,
      })

      return post
    } catch (error) {
      // Log de error
      logger.error('Error creating post', error as Error, {
        module: 'posts',
        userId: dto.userId,
      })
      throw error
    }
  }
}
```

### Diferentes Niveles de Log

```typescript
import { logger } from '@/lib/logger'

// Debug - Solo en desarrollo
logger.debug('User data fetched', { users: data, count: data.length })

// Info - Operaciones normales
logger.info('Authentication successful', {
  userId: 123,
  email: 'user@example.com',
})

// Warn - Advertencias
logger.warn('Slow query detected', { duration: 5000, query: 'posts' })

// Error - Errores con stack trace
logger.error('Failed to save data', new Error('Network timeout'), {
  module: 'posts',
  operation: 'create',
})
```

### Logger en Componentes React

```typescript
import { logger } from '@/lib/logger'
import { useEffect } from 'react'

export function PostList() {
  useEffect(() => {
    logger.debug('PostList component mounted', {
      component: 'PostList',
      props: {
        /* ... */
      },
    })

    return () => {
      logger.debug('PostList component unmounted', {
        component: 'PostList',
      })
    }
  }, [])

  const handleError = (error: Error) => {
    logger.error('Error rendering post', error, {
      component: 'PostList',
      action: 'render',
    })
  }

  // ...
}
```

### Integrar con Sentry

```typescript
// src/lib/logger/Logger.ts
import * as Sentry from '@sentry/react'

export class Logger {
  error(
    message: string,
    error?: Error,
    context?: Record<string, unknown>
  ): void {
    // Log en console
    console.error(`❌ ${message}`, error, context)

    // Enviar a Sentry en producción
    if (import.meta.env.PROD && error) {
      Sentry.captureException(error, {
        contexts: { custom: context },
        tags: { message },
      })
    }
  }
}
```

---

## 4. 🔑 Query Keys Factory

### En Hooks (Ya implementado)

```typescript
import { queryKeys } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

export function usePosts(accountId: number) {
  return useQuery({
    queryKey: queryKeys.posts.list(accountId),
    queryFn: () => fetchPosts(accountId),
  })
}

export function usePost(id: number) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => fetchPost(id),
  })
}
```

### Invalidar Cache Específico

```typescript
import { queryKeys } from '@/lib/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: (_, id) => {
      // Invalidar todas las listas
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      })

      // Invalidar el post específico
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.detail(id),
      })

      // O invalidar TODO de posts
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.all,
      })
    },
  })
}
```

### Agregar Nuevos Query Keys

```typescript
// src/lib/query-keys.ts
export const queryKeys = {
  // Existentes...
  posts: {
    /* ... */
  },
  users: {
    /* ... */
  },
  accounts: {
    /* ... */
  },

  // Nuevos módulos
  comments: {
    all: ['comments'] as const,
    lists: () => [...queryKeys.comments.all, 'list'] as const,
    list: (postId: number) => [...queryKeys.comments.lists(), postId] as const,
    details: () => [...queryKeys.comments.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.comments.details(), id] as const,
  },

  notifications: {
    all: ['notifications'] as const,
    lists: () => [...queryKeys.notifications.all, 'list'] as const,
    list: (userId: number) =>
      [...queryKeys.notifications.lists(), userId] as const,
  },
}
```

---

## 5. ❌ Errores Personalizados

### En Repositories (Ya implementado)

```typescript
import { NotFoundError, NetworkError, RepositoryError } from '@/lib/errors'

export class JsonPlaceholderPostRepository {
  async findById(id: number): Promise<Post | null> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${id}`)

      if (response.status === 404) {
        throw new NotFoundError('Post', id)
      }

      if (!response.ok) {
        throw new NetworkError(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return PostAdapter.toDomain(data)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null // No encontrado es válido
      }
      if (error instanceof NetworkError) {
        throw error // Re-lanzar error de red
      }
      throw new RepositoryError(
        error instanceof Error ? error.message : 'Unknown error',
        `obtener post ${id}`
      )
    }
  }
}
```

### Manejar Errores en UI

```typescript
import { NotFoundError, ValidationError, NetworkError } from '@/lib/errors'

export function useCreatePost() {
  return useMutation({
    mutationFn: (dto: CreatePostDto) => createPost(dto),
    onError: (error: Error) => {
      if (error instanceof ValidationError) {
        toast.error(`Validación: ${error.message}`)
        // Mostrar error en campo específico
        setFieldError(error.field, error.message)
      } else if (error instanceof NetworkError) {
        toast.error('Error de conexión. Verifica tu internet.')
      } else if (error instanceof NotFoundError) {
        toast.error('Recurso no encontrado')
      } else {
        toast.error(`Error: ${error.message}`)
      }
    },
  })
}
```

### Crear Errores Personalizados

```typescript
// src/lib/errors/DomainError.ts
export class PaymentError extends DomainError {
  constructor(
    message: string,
    public readonly transactionId: string
  ) {
    super(message, 'PAYMENT_ERROR', 402)
    this.name = 'PaymentError'
    Object.setPrototypeOf(this, PaymentError.prototype)
  }
}

export class RateLimitError extends DomainError {
  constructor(
    public readonly retryAfter: number // segundos
  ) {
    super(
      `Demasiadas solicitudes. Reintenta en ${retryAfter} segundos`,
      'RATE_LIMIT_ERROR',
      429
    )
    this.name = 'RateLimitError'
    Object.setPrototypeOf(this, RateLimitError.prototype)
  }
}
```

---

## 6. 🔗 Combinando Todo

### Ejemplo: Use Case Completo

```typescript
import { logger } from '@/lib/logger'
import { handleRepositoryError } from '@/lib/errors'
import { PostValidator } from '../../domain/entities/Post'
import type { CreatePostDto, Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'

export class CreatePostUseCase {
  constructor(private readonly repository: IPostRepository) {}

  async execute(dto: CreatePostDto): Promise<Post> {
    try {
      // 1. Validar datos (Validator)
      PostValidator.validate(dto)

      // 2. Log de inicio (Logger)
      logger.info('Creating post', {
        module: 'posts',
        userId: dto.userId,
        accountId: dto.accountId,
      })

      // 3. Ejecutar operación
      const post = await this.repository.create(dto)

      // 4. Log de éxito
      logger.info('Post created successfully', {
        module: 'posts',
        postId: post.id,
      })

      return post
    } catch (error) {
      // 5. Log de error
      logger.error('Error creating post', error as Error, {
        module: 'posts',
        userId: dto.userId,
      })

      // 6. Transformar error (Error Handler)
      handleRepositoryError(error, 'crear post')
      throw error
    }
  }
}
```

### Ejemplo: Hook Completo

```typescript
import { queryKeys } from '@/lib/query-keys'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ValidationError, NetworkError } from '@/lib/errors'

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreatePostDto) => {
      const useCase = postsContainer.getCreatePostUseCase()
      return await useCase.execute(dto)
    },
    onSuccess: post => {
      // Invalidar cache con Query Keys
      queryClient.invalidateQueries({
        queryKey: queryKeys.posts.lists(),
      })

      toast.success('Post creado exitosamente!')
    },
    onError: (error: Error) => {
      // Manejar diferentes tipos de errores
      if (error instanceof ValidationError) {
        toast.error(`Validación: ${error.message}`)
      } else if (error instanceof NetworkError) {
        toast.error('Error de conexión')
      } else {
        toast.error(`Error: ${error.message}`)
      }
    },
  })
}
```

### Ejemplo: Componente Completo

```tsx
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { useCreatePost } from '../hooks/usePostOperations'
import { logger } from '@/lib/logger'

export function PostForm() {
  const createPost = useCreatePost()

  const handleSubmit = async (data: CreatePostDto) => {
    try {
      logger.debug('Submitting post form', { component: 'PostForm', data })
      await createPost.mutateAsync(data)
    } catch (error) {
      logger.error('Form submission error', error as Error, {
        component: 'PostForm',
      })
    }
  }

  return (
    <ErrorBoundary>
      <form onSubmit={handleSubmit}>{/* Form fields */}</form>
    </ErrorBoundary>
  )
}
```

---

## 📚 Recursos Adicionales

### Archivos de Referencia:

- `src/lib/errors/DomainError.ts` - Todos los tipos de errores
- `src/lib/logger/Logger.ts` - Implementación del logger
- `src/lib/query-keys.ts` - Factory de query keys
- `src/components/shared/ErrorBoundary.tsx` - Error boundary
- `IMPLEMENTATION_SUMMARY.md` - Documentación completa

### Convenciones:

1. **Validadores:** Siempre en `domain/entities/*.ts`
2. **Logger:** Usar en Use Cases y operaciones críticas
3. **Query Keys:** Siempre usar factory, nunca strings
4. **Errores:** Lanzar errores específicos según el caso
5. **ErrorBoundary:** Envolver componentes propensos a errores

---

**Happy Coding!** 🚀
