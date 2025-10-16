# 📦 Arquitectura de DTOs - Guía Completa

## 📋 Tabla de Contenidos

- [¿Qué son los DTOs?](#-qué-son-los-dtos)
- [¿Por qué Separar DTOs de Entities?](#-por-qué-separar-dtos-de-entities)
- [Estructura de Archivos](#-estructura-de-archivos)
- [Implementación](#-implementación)
- [Patrones y Convenciones](#-patrones-y-convenciones)
- [Migración y Refactoring](#-migración-y-refactoring)

---

## 🎯 ¿Qué son los DTOs?

**DTO (Data Transfer Object)** = Objeto diseñado para transferir datos entre capas de la aplicación.

### Características:

- ✅ **Inmutables**: Solo datos, sin lógica de negocio
- ✅ **Simples**: Estructuras planas para transferencia
- ✅ **Validables**: Compatible con validadores (Zod, Yup)
- ✅ **Serializables**: Fácil conversión a JSON

### Ejemplo:

```typescript
// DTO para crear un Post
export interface CreatePostDto {
  accountId: number
  userId: number
  title: string
  body: string
}

// Entity del dominio
export interface Post {
  id: number
  accountId: number
  userId: number
  title: string
  body: string
  createdAt?: Date
  updatedAt?: Date
  // ... más propiedades de dominio
}
```

---

## 💡 ¿Por qué Separar DTOs de Entities?

### Problema: Mezclar DTOs con Entities

```typescript
// ❌ ANTES: Todo en entities/Post.ts
export interface Post {
  id: number
  title: string
  body: string
}

export interface CreatePostDto {
  title: string
  body: string
}

export interface UpdatePostDto {
  id: number
  title: string
  body: string
}
```

**Problemas:**

- 🔴 Viola **Single Responsibility Principle** (SRP)
- 🔴 Entity tiene múltiples propósitos (modelo + transferencia)
- 🔴 Difícil saber cuándo usar qué
- 🔴 Cambios en DTOs afectan el modelo de dominio

---

### Solución: Separación de Responsabilidades

```typescript
// ✅ DESPUÉS: domain/entities/Post.ts
export interface Post {
  id: number
  accountId: number
  userId: number
  title: string
  body: string
  createdAt?: Date
  updatedAt?: Date
}

// ✅ DESPUÉS: domain/dtos/CreatePostDto.ts
export interface CreatePostDto {
  accountId: number
  userId: number
  title: string
  body: string
}

// ✅ DESPUÉS: domain/dtos/UpdatePostDto.ts
export interface UpdatePostDto {
  id: number
  accountId: number
  userId: number
  title: string
  body: string
}
```

**Ventajas:**

- ✅ **SRP**: Cada archivo tiene una responsabilidad clara
- ✅ **Explícito**: DTOs indican "datos en tránsito"
- ✅ **Mantenible**: Cambios en DTOs no afectan entities
- ✅ **Escalable**: Fácil agregar nuevos DTOs

---

## 📁 Estructura de Archivos

### Organización por Módulo

```
src/modules/{module}/
└── domain/
    ├── dtos/                       # 📦 DTOs del módulo
    │   ├── index.ts                # Barrel export
    │   ├── Create{Entity}Dto.ts    # DTO para crear
    │   └── Update{Entity}Dto.ts    # DTO para actualizar
    │
    └── entities/                   # 🎯 Entities del dominio
        └── {Entity}.ts             # Solo la entity
```

### Ejemplo Real: Módulo Posts

```
src/modules/posts/
└── domain/
    ├── dtos/
    │   ├── index.ts
    │   ├── CreatePostDto.ts
    │   └── UpdatePostDto.ts
    │
    └── entities/
        └── Post.ts
```

---

## 🔧 Implementación

### 1. DTO para Crear (CreateDto)

**Propósito:** Datos necesarios para **crear** una nueva entidad

```typescript
// src/modules/posts/domain/dtos/CreatePostDto.ts

/**
 * DTO para crear un nuevo Post
 *
 * Usado en:
 * - CreatePostUseCase
 * - PostValidator.validateCreate()
 * - IPostRepository.create()
 *
 * @property accountId - ID de la cuenta propietaria
 * @property userId - ID del usuario autor
 * @property title - Título del post
 * @property body - Contenido del post
 */
export interface CreatePostDto {
  accountId: number
  userId: number
  title: string
  body: string
}
```

**Características:**

- ❌ **NO** incluye `id` (lo genera el sistema)
- ❌ **NO** incluye `createdAt`, `updatedAt` (timestamps automáticos)
- ✅ Solo campos que el usuario proporciona

---

### 2. DTO para Actualizar (UpdateDto)

**Propósito:** Datos necesarios para **actualizar** una entidad existente

```typescript
// src/modules/posts/domain/dtos/UpdatePostDto.ts

/**
 * DTO para actualizar un Post existente
 *
 * Usado en:
 * - UpdatePostUseCase
 * - PostValidator.validateUpdate()
 * - IPostRepository.update()
 *
 * @property id - ID del post a actualizar (requerido)
 * @property accountId - ID de la cuenta propietaria
 * @property userId - ID del usuario autor
 * @property title - Nuevo título
 * @property body - Nuevo contenido
 */
export interface UpdatePostDto {
  id: number // ✅ Requerido para identificar qué actualizar
  accountId: number
  userId: number
  title: string
  body: string
}
```

**Características:**

- ✅ **SÍ** incluye `id` (necesario para identificar)
- ❌ **NO** incluye timestamps (se actualizan automáticamente)
- ✅ Campos editables por el usuario

---

### 3. Barrel Export (index.ts)

**Propósito:** Simplificar imports

```typescript
// src/modules/posts/domain/dtos/index.ts

export type { CreatePostDto } from './CreatePostDto'
export type { UpdatePostDto } from './UpdatePostDto'
```

**Uso:**

```typescript
// ✅ BIEN: Import desde barrel
import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'

// ❌ MAL: Import directo de cada archivo
import type { CreatePostDto } from '../../domain/dtos/CreatePostDto'
import type { UpdatePostDto } from '../../domain/dtos/UpdatePostDto'
```

---

### 4. Entity Limpia

```typescript
// src/modules/posts/domain/entities/Post.ts

/**
 * Entidad de dominio: Post
 *
 * Representa un post en el sistema.
 * Esta entidad solo define el modelo de dominio,
 * los DTOs para transferencia están en domain/dtos/
 */
export interface Post {
  id: number
  accountId: number
  userId: number
  title: string
  body: string
  createdAt?: Date
  updatedAt?: Date
}
```

**Características:**

- ✅ Solo define el modelo de dominio
- ✅ Incluye todos los campos (incluso los generados)
- ✅ Sin DTOs mezclados
- ✅ Documentación clara

---

## 🎨 Patrones y Convenciones

### Convención de Nombres

```typescript
// Patrón: {Action}{Entity}Dto

CreatePostDto // Para crear
UpdatePostDto // Para actualizar
CreateUserDto // Para crear
UpdateUserDto // Para actualizar
```

### Campos Comunes

#### DTOs de Creación (CreateDto)

```typescript
// Campos que el usuario proporciona
accountId: number  // ¿A qué cuenta pertenece?
userId: number     // ¿Quién lo crea?
...campos editables

// ❌ NO incluir:
id                 // Lo genera el sistema
createdAt          // Timestamp automático
updatedAt          // Timestamp automático
```

#### DTOs de Actualización (UpdateDto)

```typescript
// Campos necesarios
id: number         // ✅ Para identificar qué actualizar
accountId: number
userId: number
...campos editables

// ❌ NO incluir:
createdAt          // No se edita
updatedAt          // Se actualiza automáticamente
```

---

## 📦 Uso en Diferentes Capas

### 1. Use Cases (Application)

```typescript
// src/modules/posts/application/use-cases/CreatePostUseCase.ts

import type { CreatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'

export class CreatePostUseCase {
  async execute(dto: CreatePostDto): Promise<Post> {
    // Validar DTO
    PostValidator.validateCreate(dto)

    // Crear entity
    return await this.repository.create(dto)
  }
}
```

### 2. Validators (Domain)

```typescript
// src/modules/posts/domain/validators/PostValidator.ts

import type { CreatePostDto, UpdatePostDto } from '../dtos'

export const PostValidator = {
  validateCreate(dto: CreatePostDto): void {
    if (!dto.title) throw new Error('Title is required')
    if (!dto.body) throw new Error('Body is required')
  },

  validateUpdate(dto: UpdatePostDto): void {
    if (!dto.id) throw new Error('ID is required')
    this.validateCreate(dto) // Reutilizar validación
  },
}
```

### 3. Repositories (Infrastructure)

```typescript
// src/modules/posts/infrastructure/repositories/LocalStoragePostRepository.ts

import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'

export class LocalStoragePostRepository {
  async create(dto: CreatePostDto): Promise<Post> {
    const newPost: Post = {
      id: this.generateId(),
      ...dto,
      createdAt: new Date(),
    }
    return newPost
  }

  async update(dto: UpdatePostDto): Promise<Post> {
    const post = await this.findById(dto.id)
    return {
      ...post,
      ...dto,
      updatedAt: new Date(),
    }
  }
}
```

### 4. Presentation (Hooks)

```typescript
// src/modules/posts/presentation/hooks/usePostOperations.ts

import type { CreatePostDto, UpdatePostDto } from '../../domain/dtos'
import type { Post } from '../../domain/entities/Post'

export function useCreatePost() {
  return useMutation({
    mutationFn: async (dto: CreatePostDto) => {
      const useCase = container.getCreatePostUseCase()
      return await useCase.execute(dto)
    },
  })
}
```

---

## 🔄 Migración y Refactoring

### Paso 1: Crear DTOs Separados

```bash
# Crear estructura
mkdir -p src/modules/posts/domain/dtos
touch src/modules/posts/domain/dtos/CreatePostDto.ts
touch src/modules/posts/domain/dtos/UpdatePostDto.ts
touch src/modules/posts/domain/dtos/index.ts
```

### Paso 2: Mover DTOs de Entity

**Antes:**

```typescript
// domain/entities/Post.ts
export interface Post { ... }
export interface CreatePostDto { ... }  // ❌ Mover
export interface UpdatePostDto { ... }  // ❌ Mover
```

**Después:**

```typescript
// domain/entities/Post.ts
export interface Post { ... }  // ✅ Solo entity

// domain/dtos/CreatePostDto.ts
export interface CreatePostDto { ... }  // ✅ Separado

// domain/dtos/UpdatePostDto.ts
export interface UpdatePostDto { ... }  // ✅ Separado
```

### Paso 3: Actualizar Imports

**Antes:**

```typescript
import type { Post, CreatePostDto, UpdatePostDto } from '../entities/Post'
```

**Después:**

```typescript
import type { CreatePostDto, UpdatePostDto } from '../dtos'
import type { Post } from '../entities/Post'
```

### Paso 4: Verificar

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Build
pnpm build
```

---

## 📊 Comparación: Antes vs Después

### ANTES

```
src/modules/posts/domain/
└── entities/
    └── Post.ts (100 líneas)
        ├── Post interface
        ├── CreatePostDto interface
        ├── UpdatePostDto interface
        └── validación mezclada
```

**Problemas:**

- 🔴 Archivo grande con múltiples responsabilidades
- 🔴 Difícil encontrar DTOs específicos
- 🔴 Import ambiguo: `from '../entities/Post'`

---

### DESPUÉS

```
src/modules/posts/domain/
├── dtos/                    # 📦 Transferencia de datos
│   ├── index.ts
│   ├── CreatePostDto.ts
│   └── UpdatePostDto.ts
│
└── entities/                # 🎯 Modelo de dominio
    └── Post.ts
```

**Ventajas:**

- ✅ Archivos pequeños, una responsabilidad cada uno
- ✅ Fácil encontrar DTOs por nombre
- ✅ Imports explícitos: `from '../dtos'` vs `from '../entities'`

---

## 🎯 Beneficios Clave

### 1. Single Responsibility Principle (SRP)

```
Entity:  Define el modelo de dominio
DTO:     Define la estructura de transferencia
```

### 2. Explicitness (Claridad)

```typescript
// Cuando ves esto:
import type { CreatePostDto } from '../dtos'

// Sabes inmediatamente:
// - Es un DTO (datos en tránsito)
// - Para crear (Create)
// - De un Post
```

### 3. Mantenibilidad

```
Cambiar validación de creación → Solo tocas CreatePostDto.ts
Agregar campo a entity        → Solo tocas Post.ts
Cambiar API request           → Solo tocas DTOs
```

### 4. Escalabilidad

```
Agregar nuevo DTO → Crear nuevo archivo en dtos/
No afecta:
  - Entity
  - Otros DTOs
  - Código existente
```

---

## 📚 Ejemplos Completos

### Módulo Posts

```typescript
// domain/dtos/CreatePostDto.ts
export interface CreatePostDto {
  accountId: number
  userId: number
  title: string
  body: string
}

// domain/dtos/UpdatePostDto.ts
export interface UpdatePostDto {
  id: number
  accountId: number
  userId: number
  title: string
  body: string
}

// domain/dtos/index.ts
export type { CreatePostDto } from './CreatePostDto'
export type { UpdatePostDto } from './UpdatePostDto'

// domain/entities/Post.ts
export interface Post {
  id: number
  accountId: number
  userId: number
  title: string
  body: string
  createdAt?: Date
  updatedAt?: Date
}
```

### Módulo Users

```typescript
// domain/dtos/CreateUserDto.ts
export interface CreateUserDto {
  accountId: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

// domain/dtos/UpdateUserDto.ts
export interface UpdateUserDto {
  id: number
  accountId: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

// domain/entities/User.ts
export interface User {
  id: number
  accountId: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
```

---

## 🚀 Próximos Pasos

1. ✅ DTOs separados de entities
2. ✅ Estructura organizada por módulo
3. ✅ Imports actualizados
4. 🔄 Considerar DTOs parciales (Partial DTOs)
5. 🔄 Implementar Zod schemas para runtime validation
6. 🔄 Generar DTOs automáticamente desde schemas

---

## 📖 Referencias

- [Martin Fowler - DTO Pattern](https://martinfowler.com/eaaCatalog/dataTransferObject.html)
- [Clean Architecture - DTOs](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles - SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle)

---

**Creado:** Octubre 2025  
**Última actualización:** Octubre 2025  
**Mantenedor:** Equipo de Desarrollo
