# Arquitectura de Validators Modulares

## ✅ Resumen

Se ha refactorizado la arquitectura de Validators desde estar acoplados a las entidades hacia una estructura modular separada, siguiendo los principios de Clean Architecture y Single Responsibility Principle (SRP).

## 🎯 Problema Identificado

**Pregunta del Usuario:**

> "seria bueno tambien que los Validadores de la entidad tenga su propia carpera, no crees ?"

**Problema:**

- Los Validators estaban dentro de los archivos de entidades (`Post.ts`, `User.ts`)
- Violaba el Single Responsibility Principle (SRP)
- Mezclaba definición de tipos con lógica de validación
- Dificultaba la reutilización y testing de validators

## 🔄 Solución Implementada

### Arquitectura Anterior (Acoplada)

```
src/modules/posts/domain/entities/
└── Post.ts
    ├── interface Post { ... }
    ├── interface CreatePostDto { ... }
    ├── interface UpdatePostDto { ... }
    └── class PostValidator { ... }  ❌ Mezclado con entidades
```

### Arquitectura Nueva (Modular)

```
src/modules/posts/domain/
├── entities/
│   └── Post.ts                    ✅ Solo tipos e interfaces
└── validators/
    └── PostValidator.ts            ✅ Solo lógica de validación
```

## 📦 Estructura de Validators por Módulo

### 1. Posts Module

**Estructura:**

```
src/modules/posts/domain/
├── entities/
│   └── Post.ts                    (interfaces)
└── validators/
    └── PostValidator.ts            (validación)
```

**PostValidator.ts:**

```typescript
import { ValidationError } from '@/lib/errors'
import type { CreatePostDto, Post, UpdatePostDto } from '../entities/Post'

export class PostValidator {
  private static readonly MAX_TITLE_LENGTH = 200
  private static readonly MAX_BODY_LENGTH = 5000
  private static readonly MIN_TITLE_LENGTH = 1
  private static readonly MIN_BODY_LENGTH = 1

  static validate(post: Post | CreatePostDto | UpdatePostDto): void {
    this.validateTitle(post.title)
    this.validateBody(post.body)
    this.validateUserId(post.userId)
    this.validateAccountId(post.accountId)
  }

  static validateTitle(title: string): void {
    /* ... */
  }
  static validateBody(body: string): void {
    /* ... */
  }
  static validateUserId(userId: number): void {
    /* ... */
  }
  static validateAccountId(accountId: number): void {
    /* ... */
  }
}
```

### 2. Users Module

**Estructura:**

```
src/modules/users/domain/
├── entities/
│   └── User.ts                    (interfaces)
└── validators/
    └── UserValidator.ts            (validación)
```

**UserValidator.ts:**

```typescript
import { ValidationError } from '@/lib/errors'
import type { CreateUserDto, UpdateUserDto } from '../entities/User'

export class UserValidator {
  private static readonly MAX_NAME_LENGTH = 100
  private static readonly MAX_USERNAME_LENGTH = 50
  private static readonly MAX_EMAIL_LENGTH = 100
  private static readonly MAX_PHONE_LENGTH = 30
  private static readonly MAX_WEBSITE_LENGTH = 100
  private static readonly MIN_NAME_LENGTH = 2
  private static readonly MIN_USERNAME_LENGTH = 3

  static validate(user: CreateUserDto | UpdateUserDto): void {
    this.validateName(user.name)
    this.validateUsername(user.username)
    this.validateEmail(user.email)
    this.validatePhone(user.phone)
    this.validateWebsite(user.website)
    this.validateAccountId(user.accountId)
  }

  static validateName(name: string): void {
    /* ... */
  }
  static validateUsername(username: string): void {
    /* ... */
  }
  static validateEmail(email: string): void {
    /* ... */
  }
  static validatePhone(phone: string): void {
    /* ... */
  }
  static validateWebsite(website: string): void {
    /* ... */
  }
  static validateAccountId(accountId: number): void {
    /* ... */
  }
}
```

## 🔧 Archivos Modificados

### 1. Post.ts (Limpio)

**Antes:**

```typescript
// Post.ts
export interface Post { /* ... */ }
export interface CreatePostDto { /* ... */ }
export interface UpdatePostDto { /* ... */ }
export class PostValidator { /* ... */ }  ❌
```

**Después:**

```typescript
// Post.ts
export interface Post {
  /* ... */
}
export interface CreatePostDto {
  /* ... */
}
export interface UpdatePostDto {
  /* ... */
}
// ✅ Solo tipos, sin lógica
```

### 2. User.ts (Limpio)

**Antes:**

```typescript
// User.ts
export interface User { /* ... */ }
export interface CreateUserDto { /* ... */ }
export interface UpdateUserDto { /* ... */ }
export class UserValidator { /* ... */ }  ❌
```

**Después:**

```typescript
// User.ts
export interface User {
  /* ... */
}
export interface CreateUserDto {
  /* ... */
}
export interface UpdateUserDto {
  /* ... */
}
// ✅ Solo tipos, sin lógica
```

### 3. Use Cases (Imports Actualizados)

**Antes:**

```typescript
// CreatePostUseCase.ts
import { PostValidator } from '../../domain/entities/Post'  ❌
```

**Después:**

```typescript
// CreatePostUseCase.ts
import { PostValidator } from '../../domain/validators/PostValidator'  ✅
```

**Archivos actualizados:**

- `CreatePostUseCase.ts`
- `UpdatePostUseCase.ts`
- `CreateUserUseCase.ts`
- `UpdateUserUseCase.ts`

## 💡 Ejemplos de Uso

### Uso en Use Cases

```typescript
// src/modules/posts/application/use-cases/CreatePostUseCase.ts
import { PostValidator } from '../../domain/validators/PostValidator'
import type { CreatePostDto, Post } from '../../domain/entities/Post'

export class CreatePostUseCase {
  async execute(post: CreatePostDto): Promise<Post> {
    // Validar con el validator modular
    PostValidator.validate(post)

    // Continuar con la lógica...
    return await this.postRepository.create(post)
  }
}
```

### Validaciones Individuales

```typescript
// Validar solo el título
PostValidator.validateTitle(title)

// Validar solo el body
PostValidator.validateBody(body)

// Validar todo el post
PostValidator.validate(postDto)
```

### Testing

```typescript
// Ahora es más fácil testear los validators
import { PostValidator } from '@/modules/posts/domain/validators/PostValidator'

describe('PostValidator', () => {
  it('should validate title', () => {
    expect(() => PostValidator.validateTitle('')).toThrow()
    expect(() => PostValidator.validateTitle('Valid Title')).not.toThrow()
  })
})
```

## ✨ Beneficios

### 1. Single Responsibility Principle (SRP)

```typescript
// ✅ Cada archivo tiene una sola responsabilidad
// Post.ts → Define tipos
// PostValidator.ts → Valida posts
```

### 2. Mejor Organización

```typescript
// ✅ Estructura clara y predecible
domain/
├── entities/       → Tipos e interfaces
├── validators/     → Lógica de validación
├── repositories/   → Interfaces de persistencia
└── schemas/        → Schemas de datos
```

### 3. Facilita Testing

```typescript
// ✅ Puedes importar solo el validator
import { PostValidator } from '@/modules/posts/domain/validators/PostValidator'

// No necesitas importar toda la entidad
```

### 4. Reutilización

```typescript
// ✅ Puedes usar validators en diferentes contextos
import { PostValidator } from '@/modules/posts/domain/validators/PostValidator'

// En Use Cases
CreatePostUseCase → usa PostValidator

// En UI (formularios)
PostForm → usa PostValidator.validateTitle

// En Tests
PostValidator.spec.ts → testea validaciones
```

### 5. Escalabilidad

```typescript
// ✅ Fácil agregar nuevos validators
domain/validators/
├── PostValidator.ts
├── PostTitleValidator.ts       ← Nuevo
├── PostContentValidator.ts     ← Nuevo
└── PostMetadataValidator.ts    ← Nuevo
```

### 6. Separación de Concerns

```typescript
// ✅ Cambios en validación no afectan tipos
// Cambios en tipos no afectan validación
```

## 📊 Comparación

| Aspecto            | Antes (Acoplado) | Después (Modular) |
| ------------------ | ---------------- | ----------------- |
| **SRP**            | ❌ Violado       | ✅ Respetado      |
| **Organización**   | ⚠️ Mezclado      | ✅ Separado       |
| **Testing**        | ⚠️ Complicado    | ✅ Simple         |
| **Reutilización**  | ❌ Difícil       | ✅ Fácil          |
| **Mantenibilidad** | ⚠️ Media         | ✅ Alta           |
| **Escalabilidad**  | ⚠️ Limitada      | ✅ Ilimitada      |

## 🚀 Guía para Nuevos Módulos

### Paso 1: Crear Estructura de Carpetas

```bash
mkdir -p src/modules/[module]/domain/validators
```

### Paso 2: Crear Archivo de Validator

```bash
touch src/modules/[module]/domain/validators/[Module]Validator.ts
```

### Paso 3: Implementar Validator

```typescript
// src/modules/products/domain/validators/ProductValidator.ts
import { ValidationError } from '@/lib/errors'
import type { CreateProductDto } from '../entities/Product'

export class ProductValidator {
  private static readonly MAX_NAME_LENGTH = 100
  private static readonly MIN_PRICE = 0

  static validate(product: CreateProductDto): void {
    this.validateName(product.name)
    this.validatePrice(product.price)
  }

  static validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new ValidationError('El nombre no puede estar vacío', 'name')
    }

    if (name.length > this.MAX_NAME_LENGTH) {
      throw new ValidationError(
        `El nombre no puede exceder ${this.MAX_NAME_LENGTH} caracteres`,
        'name'
      )
    }
  }

  static validatePrice(price: number): void {
    if (price < this.MIN_PRICE) {
      throw new ValidationError(
        `El precio debe ser mayor o igual a ${this.MIN_PRICE}`,
        'price'
      )
    }
  }
}
```

### Paso 4: Usar en Use Cases

```typescript
// src/modules/products/application/use-cases/CreateProductUseCase.ts
import { ProductValidator } from '../../domain/validators/ProductValidator'

export class CreateProductUseCase {
  async execute(product: CreateProductDto): Promise<Product> {
    ProductValidator.validate(product)
    return await this.repository.create(product)
  }
}
```

## 🧪 Verificación

### TypeScript

```bash
pnpm type-check
# ✅ No errors
```

### Linter

```bash
pnpm lint
# ✅ No warnings or errors
```

## 📚 Utilidades de Validación Disponibles

### En `src/lib/validators/index.ts`:

```typescript
// Funciones helper para validaciones comunes
export function isValidEmail(email: string): boolean {
  /* ... */
}
export function isValidUrl(url: string): boolean {
  /* ... */
}
export function isValidPhone(phone: string): boolean {
  /* ... */
}
export function isEmpty(str: string): boolean {
  /* ... */
}
export function hasMinLength(str: string, min: number): boolean {
  /* ... */
}
export function hasMaxLength(str: string, max: number): boolean {
  /* ... */
}
export function isInRange(value: number, min: number, max: number): boolean {
  /* ... */
}
```

### Uso en Validators:

```typescript
import { isValidEmail, hasMaxLength } from '@/lib/validators'

export class UserValidator {
  static validateEmail(email: string): void {
    if (!isValidEmail(email)) {
      throw new ValidationError('Email inválido', 'email')
    }
  }

  static validateName(name: string): void {
    if (!hasMaxLength(name, 100)) {
      throw new ValidationError('Nombre muy largo', 'name')
    }
  }
}
```

## 🎯 Siguientes Pasos

1. **Validators Complejos**: Crear validators específicos para casos complejos
2. **Validators Compartidos**: Crear validators reutilizables entre módulos
3. **Async Validators**: Implementar validaciones asíncronas (ej: verificar email único)
4. **Validators Composables**: Combinar múltiples validators

## 📖 Referencias

- **Single Responsibility Principle (SRP)** - [Clean Code](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- **Domain-Driven Design** - [Eric Evans](https://www.domainlanguage.com/ddd/)
- **Clean Architecture** - [Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## ✅ Checklist Final

- [x] Crear PostValidator en carpeta separada
- [x] Crear UserValidator en carpeta separada
- [x] Actualizar imports en Use Cases de Posts
- [x] Actualizar imports en Use Cases de Users
- [x] Remover validators de archivos de entidades
- [x] Verificar TypeScript
- [x] Verificar Linter
- [x] Crear documentación

---

**Fecha de Refactoring:** 15 de Octubre, 2025  
**Estado:** ✅ Completado  
**Impacto:** Mejora en organización y mantenibilidad sin breaking changes
