# 🔄 Arquitectura de Adapters - Guía Completa

## 📋 Tabla de Contenidos

- [¿Qué son los Adapters?](#-qué-son-los-adapters)
- [¿Por qué en Domain, no en Infrastructure?](#-por-qué-en-domain-no-en-infrastructure)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Implementación](#-implementación)
- [Patrones Defensivos](#-patrones-defensivos)
- [Uso en Repositorios](#-uso-en-repositorios)

---

## 🎯 ¿Qué son los Adapters?

**Adapter** = Objeto responsable de **transformar datos** entre diferentes representaciones.

### Propósito:

- 🔄 Transformar respuestas del API → Entidades del dominio
- 🔄 Transformar DTOs → Requests del API
- 🛡️ Proteger contra cambios en APIs externas
- 🛡️ Aplicar valores por defecto defensivos

### Ejemplo:

```typescript
// API Response (estructura externa)
{
  "id": 1,
  "name": "John",
  "email": null  // ⚠️ Puede ser null
}

// ⬇️ Adapter transforma ⬇️

// Domain Entity (estructura interna)
{
  id: 1,
  name: "John",
  email: "no-email@example.com"  // ✅ Valor por defecto
}
```

---

## 💡 ¿Por qué en Domain, no en Infrastructure?

### ❌ Ubicación INCORRECTA: Infrastructure

```
src/modules/posts/
├── domain/
└── infrastructure/
    └── adapters/          # ❌ INCORRECTO
        └── PostAdapter.ts
```

**¿Por qué está mal?**

- 🔴 Los adapters definen **reglas de transformación** → Eso es **lógica de dominio**
- 🔴 Infrastructure debe ser "tonto" (solo implementación técnica)
- 🔴 Mezcla conceptos: transformación (dominio) con implementación (infra)

---

### ✅ Ubicación CORRECTA: Domain

```
src/modules/posts/
├── domain/
│   └── adapters/          # ✅ CORRECTO
│       └── PostAdapter.ts
└── infrastructure/
    └── repositories/
```

**¿Por qué está bien?**

- ✅ Transformación = **Regla de dominio** (cómo debe ser un Post válido)
- ✅ Domain define QUÉ y CÓMO transformar
- ✅ Infrastructure solo usa el adapter (no lo define)
- ✅ Testear adapters sin tocar infrastructure

---

## 📁 Estructura de Archivos

### Organización por Módulo

```
src/modules/{module}/
├── domain/
│   ├── adapters/                    # 🔄 Adapters del módulo
│   │   ├── {Entity}Adapter.ts       # Adapter de la entidad
│   │   └── index.ts                 # Barrel export (opcional)
│   │
│   ├── dtos/
│   ├── entities/
│   └── validators/
│
└── infrastructure/
    ├── repositories/                # Usa los adapters
    └── types/                       # API types
```

### Ejemplo Real: Módulo Posts

```
src/modules/posts/
├── domain/
│   ├── adapters/
│   │   └── PostAdapter.ts          # ✅ Aquí
│   ├── dtos/
│   ├── entities/
│   └── validators/
│
└── infrastructure/
    ├── repositories/
    │   └── JsonPlaceholderPostRepository.ts  # USA PostAdapter
    └── types/
        └── PostAPITypes.ts         # Define tipos del API
```

---

## 🔧 Implementación

### 1. Estructura del Adapter

```typescript
// src/modules/posts/domain/adapters/PostAdapter.ts

import type {
  PostAPICreateRequest,
  PostAPIResponse,
  PostAPIUpdateRequest,
} from '../../infrastructure/types/PostAPITypes'
import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'

/**
 * Adaptador defensivo para transformar datos entre API y dominio
 *
 * Responsabilidades:
 * - Transformar respuestas del API → Entidades del dominio
 * - Transformar DTOs → Requests del API
 * - Aplicar valores por defecto para campos opcionales/null
 * - Proteger contra cambios en la estructura del API
 */
export const PostAdapter = {
  /**
   * Convierte una respuesta del API a una entidad Post del dominio
   */
  toDomain(apiResponse: PostAPIResponse, accountId = 1): Post {
    return {
      id: apiResponse.id ?? 0,
      accountId,
      userId: apiResponse.userId ?? 0,
      title: apiResponse.title ?? 'Untitled',
      body: apiResponse.body ?? '',
    }
  },

  /**
   * Convierte un array de respuestas del API a entidades del dominio
   */
  toDomainList(apiResponses: PostAPIResponse[], accountId = 1): Post[] {
    if (!Array.isArray(apiResponses)) {
      return []
    }
    return apiResponses.map(item => this.toDomain(item, accountId))
  },

  /**
   * Convierte un CreatePostDto a formato esperado por el API
   */
  toAPICreate(dto: CreatePostDto): PostAPICreateRequest {
    return {
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },

  /**
   * Convierte un UpdatePostDto a formato esperado por el API
   */
  toAPIUpdate(dto: UpdatePostDto): PostAPIUpdateRequest {
    return {
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },
}
```

---

### 2. API Types (Infrastructure)

```typescript
// src/modules/posts/infrastructure/types/PostAPITypes.ts

/**
 * Tipos que representan la estructura del API externo
 * (JSONPlaceholder en este caso)
 */

export interface PostAPIResponse {
  id: number
  userId: number
  title: string
  body: string
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
```

---

### 3. Uso en Repositorios

```typescript
// src/modules/posts/infrastructure/repositories/JsonPlaceholderPostRepository.ts

import { PostAdapter } from '../../domain/adapters/PostAdapter'

import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'
import type { IPostRepository } from '../../domain/repositories/IPostRepository'
import type { PostAPIResponse } from '../types/PostAPITypes'

export class JsonPlaceholderPostRepository implements IPostRepository {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com'

  findAll = async (): Promise<Post[]> => {
    const response = await fetch(`${this.baseUrl}/posts`)
    const data = (await response.json()) as PostAPIResponse[]

    // ✅ Usar adapter para transformar
    return PostAdapter.toDomainList(data)
  }

  findById = async (id: number): Promise<Post | null> => {
    const response = await fetch(`${this.baseUrl}/posts/${id}`)
    const data = (await response.json()) as PostAPIResponse

    // ✅ Usar adapter para transformar
    return PostAdapter.toDomain(data)
  }

  create = async (dto: CreatePostDto): Promise<Post> => {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // ✅ Usar adapter para preparar request
      body: JSON.stringify(PostAdapter.toAPICreate(dto)),
    })
    const data = (await response.json()) as PostAPIResponse

    // ✅ Usar adapter para transformar respuesta
    return PostAdapter.toDomain(data)
  }

  update = async (dto: UpdatePostDto): Promise<Post> => {
    const response = await fetch(`${this.baseUrl}/posts/${dto.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      // ✅ Usar adapter para preparar request
      body: JSON.stringify(PostAdapter.toAPIUpdate(dto)),
    })
    const data = (await response.json()) as PostAPIResponse

    // ✅ Usar adapter para transformar respuesta
    return PostAdapter.toDomain(data)
  }
}
```

---

## 🛡️ Patrones Defensivos

### 1. Valores por Defecto

```typescript
toDomain(apiResponse: PostAPIResponse): Post {
  return {
    // ✅ Nullish coalescing para valores por defecto
    id: apiResponse.id ?? 0,
    title: apiResponse.title ?? 'Untitled',
    body: apiResponse.body ?? '',
    // ✅ Protege contra undefined/null del API
  }
}
```

**¿Por qué?**

- APIs pueden cambiar sin avisar
- Campos pueden ser `null` o `undefined`
- Previene errores en tiempo de ejecución

---

### 2. Validación de Arrays

```typescript
toDomainList(apiResponses: PostAPIResponse[]): Post[] {
  // ✅ Validar que sea array
  if (!Array.isArray(apiResponses)) {
    return []
  }

  return apiResponses.map(item => this.toDomain(item))
}
```

**¿Por qué?**

- API puede devolver `null` en lugar de array vacío
- Previene errores "map is not a function"

---

### 3. Transformación de Objetos Anidados

```typescript
// Ejemplo: User con address y company

toDomain(apiResponse: UserAPIResponse): User {
  return {
    id: apiResponse.id ?? 0,
    name: apiResponse.name ?? 'Unknown',

    // ✅ Transformar objetos anidados con valores por defecto
    address: {
      street: apiResponse.address?.street ?? 'N/A',
      suite: apiResponse.address?.suite ?? 'N/A',
      city: apiResponse.address?.city ?? 'N/A',
      zipcode: apiResponse.address?.zipcode ?? 'N/A',
    },

    company: {
      name: apiResponse.company?.name ?? 'N/A',
      catchPhrase: apiResponse.company?.catchPhrase ?? 'N/A',
      bs: apiResponse.company?.bs ?? 'N/A',
    },
  }
}
```

**¿Por qué?**

- Objetos anidados pueden ser `undefined`
- Previene acceso a propiedades de `undefined`

---

### 4. Campos Adicionales del Dominio

```typescript
toDomain(apiResponse: PostAPIResponse, accountId = 1): Post {
  return {
    // Campos del API
    id: apiResponse.id ?? 0,
    userId: apiResponse.userId ?? 0,
    title: apiResponse.title ?? 'Untitled',
    body: apiResponse.body ?? '',

    // ✅ Campos adicionales del dominio (no en API)
    accountId,  // Parámetro adicional
    createdAt: new Date(),  // Timestamp local
  }
}
```

**¿Por qué?**

- Domain puede tener campos que el API no provee
- Permite enriquecer datos

---

## 📊 Comparación: Antes vs Después

### ANTES: Sin Adapter (transformación inline)

```typescript
// ❌ Repositorio con transformación inline
export class JsonPlaceholderPostRepository {
  findAll = async (): Promise<Post[]> => {
    const data = await fetch(...)

    // ❌ Transformación mezclada con lógica de repositorio
    return data.map(item => ({
      id: item.id ?? 0,
      title: item.title ?? 'Untitled',
      body: item.body ?? '',
      // ... repetir en cada método
    }))
  }

  findById = async (id: number): Promise<Post | null> => {
    const data = await fetch(...)

    // ❌ Duplicar la misma lógica de transformación
    return {
      id: data.id ?? 0,
      title: data.title ?? 'Untitled',
      body: data.body ?? '',
    }
  }
}
```

**Problemas:**

- 🔴 Duplicación de código (transformación repetida)
- 🔴 Repositorio hace demasiado (fetch + transformación)
- 🔴 Difícil testear transformación por separado
- 🔴 Cambios en transformación requieren editar múltiples métodos

---

### DESPUÉS: Con Adapter

```typescript
// ✅ Adapter centralizado
export const PostAdapter = {
  toDomain(apiResponse: PostAPIResponse): Post {
    return {
      id: apiResponse.id ?? 0,
      title: apiResponse.title ?? 'Untitled',
      body: apiResponse.body ?? '',
    }
  },

  toDomainList(apiResponses: PostAPIResponse[]): Post[] {
    return apiResponses.map(item => this.toDomain(item))
  },
}

// ✅ Repositorio delega transformación
export class JsonPlaceholderPostRepository {
  findAll = async (): Promise<Post[]> => {
    const data = await fetch(...)
    return PostAdapter.toDomainList(data)  // ✅ Simple
  }

  findById = async (id: number): Promise<Post | null> => {
    const data = await fetch(...)
    return PostAdapter.toDomain(data)  // ✅ Simple
  }
}
```

**Ventajas:**

- ✅ DRY: Transformación definida una sola vez
- ✅ SRP: Repositorio solo hace fetch, Adapter solo transforma
- ✅ Testeable: Adapter se testea independientemente
- ✅ Mantenible: Cambios en una sola ubicación

---

## 🧪 Testing de Adapters

### Test Unitario

```typescript
// PostAdapter.test.ts

import { PostAdapter } from '../PostAdapter'
import type { PostAPIResponse } from '../../../infrastructure/types/PostAPITypes'

describe('PostAdapter', () => {
  describe('toDomain', () => {
    it('debe transformar respuesta completa del API', () => {
      const apiResponse: PostAPIResponse = {
        id: 1,
        userId: 5,
        title: 'Test Post',
        body: 'Test content',
      }

      const result = PostAdapter.toDomain(apiResponse)

      expect(result).toEqual({
        id: 1,
        accountId: 1, // Valor por defecto
        userId: 5,
        title: 'Test Post',
        body: 'Test content',
      })
    })

    it('debe aplicar valores por defecto si faltan campos', () => {
      const apiResponse = {
        id: undefined,
        title: null,
      } as unknown as PostAPIResponse

      const result = PostAdapter.toDomain(apiResponse)

      expect(result.id).toBe(0)
      expect(result.title).toBe('Untitled')
      expect(result.body).toBe('')
    })
  })

  describe('toDomainList', () => {
    it('debe retornar array vacío si input no es array', () => {
      const result = PostAdapter.toDomainList(null as any)
      expect(result).toEqual([])
    })

    it('debe transformar array de respuestas', () => {
      const apiResponses: PostAPIResponse[] = [
        { id: 1, userId: 1, title: 'Post 1', body: 'Body 1' },
        { id: 2, userId: 2, title: 'Post 2', body: 'Body 2' },
      ]

      const result = PostAdapter.toDomainList(apiResponses)

      expect(result).toHaveLength(2)
      expect(result[0].id).toBe(1)
      expect(result[1].id).toBe(2)
    })
  })
})
```

---

## 📝 Patrones y Convenciones

### Convención de Nombres

```typescript
// Patrón: {Entity}Adapter

PostAdapter
UserAdapter
AccountAdapter
ProductAdapter
```

### Métodos Estándar

```typescript
export const EntityAdapter = {
  // API → Domain
  toDomain(apiResponse: EntityAPIResponse): Entity
  toDomainList(apiResponses: EntityAPIResponse[]): Entity[]

  // Domain → API
  toAPICreate(dto: CreateEntityDto): EntityAPICreateRequest
  toAPIUpdate(dto: UpdateEntityDto): EntityAPIUpdateRequest
}
```

---

## 🎯 Casos de Uso Avanzados

### 1. Múltiples APIs

```typescript
export const PostAdapter = {
  // JSONPlaceholder API
  fromJSONPlaceholder(response: JSONPlaceholderPost): Post { ... },

  // GraphQL API
  fromGraphQL(response: GraphQLPost): Post { ... },

  // REST v2 API
  fromRESTv2(response: RESTv2Post): Post { ... },
}
```

### 2. Enriquecimiento de Datos

```typescript
toDomain(apiResponse: PostAPIResponse, enrichData?: EnrichData): Post {
  return {
    ...this.basicTransform(apiResponse),

    // ✅ Enriquecer con datos adicionales
    authorName: enrichData?.authorName,
    categoryName: enrichData?.categoryName,
    tags: enrichData?.tags ?? [],
  }
}
```

### 3. Transformación Condicional

```typescript
toDomain(apiResponse: PostAPIResponse, options?: Options): Post {
  const base = {
    id: apiResponse.id ?? 0,
    title: apiResponse.title ?? 'Untitled',
  }

  // ✅ Transformación condicional según opciones
  if (options?.includeBody) {
    base.body = apiResponse.body ?? ''
  }

  if (options?.parseMarkdown) {
    base.bodyHtml = markdownToHtml(base.body)
  }

  return base
}
```

---

## 🚀 Beneficios Clave

### 1. Separación de Responsabilidades

```
Infrastructure: Fetch/Save datos (comunicación)
Adapter:        Transformar datos (lógica de dominio)
Domain:         Validar/Usar datos (reglas de negocio)
```

### 2. Protección contra Cambios del API

```
API cambia estructura → Solo editas Adapter
Repositories siguen funcionando sin cambios ✅
```

### 3. Testabilidad

```typescript
// Test adapter sin tocar network
const mockResponse = { id: 1, ... }
const result = Adapter.toDomain(mockResponse)
expect(result.id).toBe(1)
```

### 4. Reutilización

```
Mismo adapter usado por:
  - JsonPlaceholderRepository
  - LocalStorageRepository
  - InMemoryRepository
```

---

## 📚 Ejemplos Completos

### PostAdapter (Simple)

```typescript
export const PostAdapter = {
  toDomain(apiResponse: PostAPIResponse, accountId = 1): Post {
    return {
      id: apiResponse.id ?? 0,
      accountId,
      userId: apiResponse.userId ?? 0,
      title: apiResponse.title ?? 'Untitled',
      body: apiResponse.body ?? '',
    }
  },

  toDomainList(apiResponses: PostAPIResponse[], accountId = 1): Post[] {
    if (!Array.isArray(apiResponses)) return []
    return apiResponses.map(item => this.toDomain(item, accountId))
  },

  toAPICreate(dto: CreatePostDto): PostAPICreateRequest {
    return {
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },

  toAPIUpdate(dto: UpdatePostDto): PostAPIUpdateRequest {
    return {
      id: dto.id,
      userId: dto.userId,
      title: dto.title,
      body: dto.body,
    }
  },
}
```

### UserAdapter (Complejo - con objetos anidados)

```typescript
export const UserAdapter = {
  toDomain(apiResponse: UserAPIResponse, accountId = 1): User {
    return {
      id: apiResponse.id ?? 0,
      accountId,
      name: apiResponse.name ?? 'Unknown User',
      username: apiResponse.username ?? 'anonymous',
      email: apiResponse.email ?? 'no-email@example.com',
      phone: apiResponse.phone ?? 'N/A',
      website: apiResponse.website ?? 'N/A',

      // Objetos anidados con valores por defecto
      address: {
        street: apiResponse.address?.street ?? 'N/A',
        suite: apiResponse.address?.suite ?? 'N/A',
        city: apiResponse.address?.city ?? 'N/A',
        zipcode: apiResponse.address?.zipcode ?? 'N/A',
      },

      company: {
        name: apiResponse.company?.name ?? 'N/A',
        catchPhrase: apiResponse.company?.catchPhrase ?? 'N/A',
        bs: apiResponse.company?.bs ?? 'N/A',
      },
    }
  },

  toDomainList(apiResponses: UserAPIResponse[], accountId = 1): User[] {
    if (!Array.isArray(apiResponses)) return []
    return apiResponses.map(item => this.toDomain(item, accountId))
  },

  toAPICreate(dto: CreateUserDto): UserAPICreateRequest {
    return {
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
    }
  },

  toAPIUpdate(dto: UpdateUserDto): UserAPIUpdateRequest {
    return {
      id: dto.id,
      name: dto.name,
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      website: dto.website,
    }
  },
}
```

---

## 🔄 Migración: Infrastructure → Domain

### Paso 1: Crear Adapter en Domain

```bash
# Crear estructura
mkdir -p src/modules/posts/domain/adapters
touch src/modules/posts/domain/adapters/PostAdapter.ts
```

### Paso 2: Mover Código

**Antes (infrastructure):**

```typescript
// infrastructure/adapters/PostAdapter.ts
import type { Post, CreatePostDto } from '../../domain/entities/Post'

export const PostAdapter = { ... }
```

**Después (domain):**

```typescript
// domain/adapters/PostAdapter.ts
import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'
import type { PostAPIResponse } from '../../infrastructure/types/PostAPITypes'

export const PostAdapter = { ... }
```

### Paso 3: Deprecar Archivo Viejo

```typescript
// infrastructure/adapters/PostAdapter.ts

/**
 * @deprecated Este archivo está deprecado.
 * Usa: import { PostAdapter } from '../../domain/adapters/PostAdapter'
 *
 * Los adapters son lógica de dominio (transformación de datos),
 * no de infraestructura. Este archivo se mantiene por compatibilidad.
 */
export { PostAdapter } from '../../domain/adapters/PostAdapter'
```

### Paso 4: Actualizar Imports

```typescript
// Antes
import { PostAdapter } from '../adapters/PostAdapter'

// Después
import { PostAdapter } from '../../domain/adapters/PostAdapter'
```

---

## 🎓 Resumen

### Adapters en Clean Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER              │
│  (Components, Hooks, Pages)             │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         APPLICATION LAYER               │
│  (Use Cases)                            │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          DOMAIN LAYER                   │
│  • Entities                             │
│  • DTOs                                 │
│  • Adapters    ← 🔄 AQUÍ               │
│  • Validators                           │
│  • Repositories (interfaces)            │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│       INFRASTRUCTURE LAYER              │
│  • Repositories (implementations)       │
│  • API Types                            │
│  • External Services                    │
│                                         │
│  Usa Adapters del Domain ↑              │
└─────────────────────────────────────────┘
```

### Checklist de Implementación

- [x] Adapters en `domain/adapters/`
- [x] API Types en `infrastructure/types/`
- [x] Valores por defecto para todos los campos
- [x] Validación de arrays
- [x] Manejo de objetos anidados
- [x] Métodos `toDomain`, `toDomainList`, `toAPICreate`, `toAPIUpdate`
- [x] Documentación con JSDoc
- [x] Tests unitarios

---

## 📖 Referencias

- [Adapter Pattern - GOF](https://en.wikipedia.org/wiki/Adapter_pattern)
- [Clean Architecture - Adapters](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Adapters](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Creado:** Octubre 2025  
**Última actualización:** Octubre 2025  
**Mantenedor:** Equipo de Desarrollo
