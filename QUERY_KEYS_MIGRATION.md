# Migración de Query Keys: Centralizado → Modular

## ✅ Resumen

Se ha completado exitosamente la migración de Query Keys desde un enfoque centralizado hacia una arquitectura modular, mejorando la escalabilidad y siguiendo los principios de Clean Architecture.

## 🎯 Problema Identificado

**Pregunta del Usuario:**

> "esta bien que todos los queryKeys esten aqui? que pasa si son mas de 100 querys?"

**Problema:**

- Todos los query keys estaban centralizados en `src/lib/query-keys.ts`
- No escalaba bien para aplicaciones con muchas queries (100+)
- Violaba el principio de separación de responsabilidades
- Dificultaba el mantenimiento a medida que crecía la aplicación

## 🔄 Solución Implementada

### Arquitectura Anterior (Centralizada)

```
src/lib/query-keys.ts
├── posts: { all, lists(), list(), details(), detail() }
├── users: { all, lists(), list(), details(), detail() }
└── accounts: { all, lists(), details(), detail() }
```

### Arquitectura Nueva (Modular)

```
src/modules/
├── posts/presentation/query-keys/postQueryKeys.ts
├── users/presentation/query-keys/userQueryKeys.ts
└── accounts/presentation/query-keys/accountQueryKeys.ts
```

## 📦 Archivos Creados

### 1. Post Query Keys

**Ubicación:** `src/modules/posts/presentation/query-keys/postQueryKeys.ts`

```typescript
export const postQueryKeys = {
  all: ['posts'] as const,
  lists: () => [...postQueryKeys.all, 'list'] as const,
  list: (accountId: number) => [...postQueryKeys.lists(), accountId] as const,
  details: () => [...postQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...postQueryKeys.details(), id] as const,
} as const
```

### 2. User Query Keys

**Ubicación:** `src/modules/users/presentation/query-keys/userQueryKeys.ts`

```typescript
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (accountId: number) => [...userQueryKeys.lists(), accountId] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
} as const
```

### 3. Account Query Keys

**Ubicación:** `src/modules/accounts/presentation/query-keys/accountQueryKeys.ts`

```typescript
export const accountQueryKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountQueryKeys.all, 'list'] as const,
  details: () => [...accountQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...accountQueryKeys.details(), id] as const,
} as const
```

## 🔧 Archivos Modificados

### 1. usePostOperations.ts

**Cambios:**

```diff
- import { queryKeys } from '@/lib/query-keys'
+ import { postQueryKeys } from '../query-keys/postQueryKeys'

- queryKey: queryKeys.posts.list(accountId)
+ queryKey: postQueryKeys.list(accountId)

- queryKey: queryKeys.posts.detail(id)
+ queryKey: postQueryKeys.detail(id)

- queryKey: queryKeys.posts.lists()
+ queryKey: postQueryKeys.lists()
```

### 2. useUserOperations.ts

**Cambios:**

```diff
- import { queryKeys } from '@/lib/query-keys'
+ import { userQueryKeys } from '../query-keys/userQueryKeys'

- queryKey: queryKeys.users.list(accountId)
+ queryKey: userQueryKeys.list(accountId)

- queryKey: queryKeys.users.detail(id)
+ queryKey: userQueryKeys.detail(id)

- queryKey: queryKeys.users.lists()
+ queryKey: userQueryKeys.lists()
```

### 3. useAccountOperations.ts

**Cambios:**

```diff
- import { queryKeys } from '@/lib/query-keys'
+ import { accountQueryKeys } from '../query-keys/accountQueryKeys'

- queryKey: queryKeys.accounts.all
+ queryKey: accountQueryKeys.all

- queryKey: queryKeys.accounts.detail(id)
+ queryKey: accountQueryKeys.detail(id)
```

### 4. src/lib/query-keys.ts (Deprecado)

**Cambios:**

```typescript
/**
 * @deprecated Este archivo está deprecado. Los query keys se han movido a sus respectivos módulos:
 * - Posts: src/modules/posts/presentation/query-keys/postQueryKeys.ts
 * - Users: src/modules/users/presentation/query-keys/userQueryKeys.ts
 * - Accounts: src/modules/accounts/presentation/query-keys/accountQueryKeys.ts
 */
/* eslint-disable @typescript-eslint/no-deprecated */
export const queryKeys = {
  // ... código existente
}
```

## 📚 Documentación Creada

### 1. QUERY_KEYS_ARCHITECTURE.md

Guía completa sobre la arquitectura de Query Keys:

- Descripción general
- Arquitectura modular
- Estructura jerárquica
- Ejemplos de uso
- Beneficios
- Guía de migración
- Referencias

## ✨ Beneficios

### 1. Escalabilidad

- ✅ Cada módulo puede tener ilimitadas queries sin afectar otros módulos
- ✅ No hay un archivo centralizado que crezca indefinidamente
- ✅ Fácil agregar nuevas queries al módulo correspondiente

### 2. Mantenibilidad

- ✅ Cambios localizados en el módulo afectado
- ✅ No hay riesgo de afectar queries de otros módulos
- ✅ Código más organizado y predecible

### 3. Separación de Responsabilidades

- ✅ Cada módulo posee sus propios query keys
- ✅ Sigue principios de Clean Architecture
- ✅ Respeta los límites de módulos

### 4. Type Safety

- ✅ TypeScript infiere tipos correctamente por módulo
- ✅ Autocompletado específico para cada módulo
- ✅ Errores de tipo más claros

### 5. Facilita Testing

- ✅ Mocks más simples y específicos
- ✅ No necesitas importar todo el factory
- ✅ Tests más aislados

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

### Build

```bash
pnpm build
# ✅ Build successful
```

## 📊 Estadísticas

| Métrica                    | Antes           | Después             |
| -------------------------- | --------------- | ------------------- |
| **Archivos de Query Keys** | 1 centralizado  | 3 modulares         |
| **Líneas por archivo**     | ~60 líneas      | ~20 líneas cada uno |
| **Imports necesarios**     | 1 import global | 1 import específico |
| **Escalabilidad**          | ❌ Limitada     | ✅ Ilimitada        |
| **Mantenibilidad**         | ⚠️ Media        | ✅ Alta             |

## 🚀 Próximos Pasos

### Para Nuevos Módulos

1. Crear carpeta `presentation/query-keys/` en el nuevo módulo
2. Crear archivo `[module]QueryKeys.ts`
3. Implementar la estructura jerárquica estándar
4. Importar en los hooks del módulo

### Ejemplo para módulo "Products"

```typescript
// src/modules/products/presentation/query-keys/productQueryKeys.ts
export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  list: (categoryId: number) =>
    [...productQueryKeys.lists(), categoryId] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
} as const
```

## 📖 Referencias

- **QUERY_KEYS_ARCHITECTURE.md** - Documentación completa de la arquitectura
- **IMPLEMENTATION_SUMMARY.md** - Resumen de todas las implementaciones
- **USAGE_GUIDE.md** - Guía de uso de utilidades

## ✅ Checklist Final

- [x] Crear 3 archivos de query keys modulares
- [x] Migrar usePostOperations.ts
- [x] Migrar useUserOperations.ts
- [x] Migrar useAccountOperations.ts
- [x] Deprecar archivo centralizado
- [x] Verificar TypeScript
- [x] Verificar Linter
- [x] Crear documentación
- [x] Agregar ejemplos de uso

---

**Fecha de Migración:** 15 de Octubre, 2025  
**Estado:** ✅ Completado  
**Impacto:** 0 breaking changes (backward compatible via deprecation)
