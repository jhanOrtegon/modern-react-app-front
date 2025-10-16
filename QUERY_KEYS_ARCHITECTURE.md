# Query Keys Architecture

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura Modular](#arquitectura-modular)
- [Estructura de Query Keys](#estructura-de-query-keys)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Beneficios](#beneficios)
- [Migración](#migración)

## 📖 Descripción General

Los **Query Keys** son identificadores únicos que TanStack Query utiliza para gestionar el cache de datos. Esta aplicación utiliza una arquitectura modular donde cada módulo posee sus propios query keys, proporcionando mejor escalabilidad y mantenibilidad.

### ¿Por qué Query Keys Modulares?

**Problema con el Enfoque Centralizado:**

```typescript
// ❌ Todos los query keys en un archivo
// src/lib/query-keys.ts
export const queryKeys = {
  posts: { ... },    // 20 keys
  users: { ... },    // 20 keys
  accounts: { ... }, // 20 keys
  products: { ... }, // 20 keys
  orders: { ... },   // 20 keys
  // ... 100+ query keys en un solo archivo
}
```

**Solución con Enfoque Modular:**

```typescript
// ✅ Cada módulo tiene sus propios query keys
// src/modules/posts/presentation/query-keys/postQueryKeys.ts
export const postQueryKeys = { ... }

// src/modules/users/presentation/query-keys/userQueryKeys.ts
export const userQueryKeys = { ... }
```

## 🏗️ Arquitectura Modular

### Ubicación de Query Keys

```
src/modules/
├── posts/
│   └── presentation/
│       └── query-keys/
│           └── postQueryKeys.ts    ← Query keys del módulo Posts
├── users/
│   └── presentation/
│       └── query-keys/
│           └── userQueryKeys.ts    ← Query keys del módulo Users
└── accounts/
    └── presentation/
        └── query-keys/
            └── accountQueryKeys.ts ← Query keys del módulo Accounts
```

### Principios de Diseño

1. **Separación de Responsabilidades**: Cada módulo posee sus query keys
2. **Escalabilidad**: Agregar nuevas queries no afecta otros módulos
3. **Mantenibilidad**: Cambios localizados en el módulo correspondiente
4. **Type Safety**: TypeScript infiere correctamente los tipos por módulo

## 📐 Estructura de Query Keys

### Jerarquía Estándar

Los query keys siguen una estructura jerárquica que facilita la invalidación de cache:

```typescript
{
  ;(all, // ['entity']
    lists(), // ['entity', 'list']
    list(id), // ['entity', 'list', id]
    details(), // ['entity', 'detail']
    detail(id)) // ['entity', 'detail', id]
}
```

### Ejemplo: Post Query Keys

```typescript
// src/modules/posts/presentation/query-keys/postQueryKeys.ts

/**
 * Query Keys para el módulo Posts
 *
 * Estructura jerárquica:
 * - all: Todos los posts
 * - lists(): Lista de posts (base)
 * - list(accountId): Posts filtrados por cuenta
 * - details(): Detalles de posts (base)
 * - detail(id): Detalle de un post específico
 */
export const postQueryKeys = {
  all: ['posts'] as const,

  lists: () => [...postQueryKeys.all, 'list'] as const,

  list: (accountId: number) => [...postQueryKeys.lists(), accountId] as const,

  details: () => [...postQueryKeys.all, 'detail'] as const,

  detail: (id: number) => [...postQueryKeys.details(), id] as const,
} as const
```

### Ejemplo: User Query Keys

```typescript
// src/modules/users/presentation/query-keys/userQueryKeys.ts

export const userQueryKeys = {
  all: ['users'] as const,

  lists: () => [...userQueryKeys.all, 'list'] as const,

  list: (accountId: number) => [...userQueryKeys.lists(), accountId] as const,

  details: () => [...userQueryKeys.all, 'detail'] as const,

  detail: (id: number) => [...userQueryKeys.details(), id] as const,
} as const
```

### Ejemplo: Account Query Keys

```typescript
// src/modules/accounts/presentation/query-keys/accountQueryKeys.ts

export const accountQueryKeys = {
  all: ['accounts'] as const,

  lists: () => [...accountQueryKeys.all, 'list'] as const,

  details: () => [...accountQueryKeys.all, 'detail'] as const,

  detail: (id: number) => [...accountQueryKeys.details(), id] as const,
} as const
```

## 💡 Ejemplos de Uso

### Uso en Hooks (useQuery)

```typescript
// src/modules/posts/presentation/hooks/usePostOperations.ts
import { useQuery } from '@tanstack/react-query'
import { postQueryKeys } from '../query-keys/postQueryKeys'

export function usePostsList(accountId: number) {
  return useQuery({
    queryKey: postQueryKeys.list(accountId),
    queryFn: () => getPostsUseCase.execute(accountId),
  })
}

export function usePostDetail(id: number) {
  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: () => getPostUseCase.execute(id),
    enabled: !!id,
  })
}
```

### Invalidación de Cache

```typescript
// Invalidar TODAS las queries de posts
queryClient.invalidateQueries({
  queryKey: postQueryKeys.all,
})

// Invalidar solo las listas de posts
queryClient.invalidateQueries({
  queryKey: postQueryKeys.lists(),
})

// Invalidar una lista específica de posts
queryClient.invalidateQueries({
  queryKey: postQueryKeys.list(accountId),
})

// Invalidar un post específico
queryClient.invalidateQueries({
  queryKey: postQueryKeys.detail(postId),
})
```

### Uso en Mutations

```typescript
export function useUpdatePost(): UseMutationResult<Post, Error, UpdatePostDTO> {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdatePostDTO) => updatePostUseCase.execute(data),

    onSuccess: data => {
      // Invalidar todas las listas
      void queryClient.invalidateQueries({
        queryKey: postQueryKeys.lists(),
      })

      // Actualizar el detalle del post específico
      queryClient.setQueryData(postQueryKeys.detail(data.id), data)

      toast.success('Post actualizado correctamente')
    },

    onError: error => {
      toast.error(`Error al actualizar: ${error.message}`)
    },
  })
}
```

## ✨ Beneficios

### 1. Escalabilidad

```typescript
// ✅ Fácil agregar nuevas queries sin afectar otros módulos
export const postQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...],
  list: (accountId: number) => [...],
  details: () => [...],
  detail: (id: number) => [...],

  // Agregar nuevas queries sin problemas
  drafts: () => [...postQueryKeys.all, 'drafts'] as const,
  draft: (id: number) => [...postQueryKeys.drafts(), id] as const,
  published: () => [...postQueryKeys.all, 'published'] as const,
}
```

### 2. Mantenibilidad

```typescript
// ✅ Cambios localizados en el módulo
// Solo necesitas editar postQueryKeys.ts para posts
// No afectas userQueryKeys.ts ni accountQueryKeys.ts
```

### 3. Type Safety

```typescript
// ✅ TypeScript infiere correctamente los tipos
const key1 = postQueryKeys.all // readonly ["posts"]
const key2 = postQueryKeys.list(1) // readonly ["posts", "list", 1]
const key3 = postQueryKeys.detail(42) // readonly ["posts", "detail", 42]
```

### 4. Separación de Responsabilidades

```typescript
// ✅ Cada módulo es independiente
import { postQueryKeys } from '../query-keys/postQueryKeys'
// No necesitas importar userQueryKeys si no lo usas
```

### 5. Facilita Testing

```typescript
// ✅ Puedes mockear solo los query keys necesarios
const mockPostQueryKeys = {
  all: ['posts'] as const,
  list: (id: number) => ['posts', 'list', id] as const,
}
```

## 🔄 Migración

### Migración Desde Enfoque Centralizado

**Antes (Centralizado):**

```typescript
// src/lib/query-keys.ts
import { queryKeys } from '@/lib/query-keys'

const { data } = useQuery({
  queryKey: queryKeys.posts.list(accountId),
  queryFn: () => getPosts(accountId),
})
```

**Después (Modular):**

```typescript
// src/modules/posts/presentation/hooks/usePostOperations.ts
import { postQueryKeys } from '../query-keys/postQueryKeys'

const { data } = useQuery({
  queryKey: postQueryKeys.list(accountId),
  queryFn: () => getPosts(accountId),
})
```

### Pasos de Migración

1. **Crear archivo de query keys en el módulo**

   ```bash
   mkdir -p src/modules/[module]/presentation/query-keys
   touch src/modules/[module]/presentation/query-keys/[module]QueryKeys.ts
   ```

2. **Copiar la estructura desde el archivo centralizado**

   ```typescript
   export const [module]QueryKeys = {
     // Copiar desde queryKeys.[module]
   }
   ```

3. **Actualizar imports en hooks**

   ```typescript
   // Cambiar
   import { queryKeys } from '@/lib/query-keys'

   // Por
   import { [module]QueryKeys } from '../query-keys/[module]QueryKeys'
   ```

4. **Actualizar referencias**

   ```typescript
   // Cambiar
   queryKeys.[module].list(id)

   // Por
   [module]QueryKeys.list(id)
   ```

5. **Verificar compilación**
   ```bash
   pnpm type-check
   pnpm lint
   ```

## 📚 Referencias

- [TanStack Query - Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys#use-query-key-factories)
- [TanStack Query - Query Invalidation](https://tanstack.com/query/latest/docs/framework/react/guides/query-invalidation)
- [Clean Architecture - Separation of Concerns](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## 🎯 Siguientes Pasos

1. **Agregar nuevas queries**: Simplemente edita el archivo `[module]QueryKeys.ts`
2. **Crear nuevos módulos**: Sigue la misma estructura en la carpeta `presentation/query-keys/`
3. **Testing**: Considera crear mocks de query keys para tests unitarios
4. **Documentación**: Documenta queries complejas con JSDoc en los query keys

---

**Archivo Deprecado:** El archivo `src/lib/query-keys.ts` está marcado como `@deprecated` y se mantendrá por compatibilidad, pero no debe usarse en código nuevo.
