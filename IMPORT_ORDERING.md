# 📋 Guía de Ordenamiento de Imports

Este proyecto utiliza un sistema automático y estricto de ordenamiento de imports para mantener la consistencia y legibilidad del código.

## 🔧 Herramientas Configuradas

### 1. **Prettier Plugin** (`@trivago/prettier-plugin-sort-imports`)

Ordena automáticamente los imports al formatear el código.

### 2. **ESLint Plugin** (`eslint-plugin-import`)

Valida el ordenamiento y lanza errores si los imports no están correctamente organizados.

## 📐 Orden de Imports

Los imports se organizan en los siguientes grupos (con línea en blanco entre cada uno):

### 1. **React Core** (Siempre primero)

```typescript
import { useState } from 'react'

import { createRoot } from 'react-dom/client'
```

### 2. **Librerías de Terceros** (External)

```typescript
import { QueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
```

### 3. **Componentes Globales** (`@/components`)

```typescript
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Button } from '@/components/ui/button'
```

### 4. **Utilidades** (`@/lib`)

```typescript
import { formatDate } from '@/lib/formatters'
import { isValidEmail } from '@/lib/validators'
```

### 5. **Stores** (`@/stores`)

```typescript
import { useAuthStore } from '@/stores/authStore'
```

### 6. **Módulos** (`@/modules`)

```typescript
import { useAccounts } from '@/modules/accounts/presentation/hooks/useAccountOperations'
```

### 7. **Imports Relativos** (Mismo módulo)

```typescript
import type { Post } from '../../domain/entities/Post'
import { usePostFormLogic } from '../hooks/usePostFormLogic'
```

## ✅ Ejemplo Completo

```typescript
// 1. React
import { useMemo, useState } from 'react'
import type { ReactElement } from 'react'

// 2. Terceros
import { Plus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

// 3. Componentes
import { AnimatedCard } from '@/components/shared/AnimatedCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'

// 4. Librerías
import { formatDate } from '@/lib/formatters'

// 5. Stores
import { useAuthStore } from '@/stores/authStore'

// 6. Módulos
import { useAccounts } from '@/modules/accounts/presentation/hooks/useAccountOperations'

// 7. Relativos
import { usePosts } from '../hooks/usePostOperations'
```

## 🚨 Reglas Estrictas de ESLint

### Errores que se detectan:

1. **Imports desordenados**

```typescript
// ❌ Error: imports fuera de orden
import { Button } from '@/components/ui/button'
import { useState } from 'react' // React debe ir primero

// ✅ Correcto
import { useState } from 'react'

import { Button } from '@/components/ui/button'
```

2. **Falta de línea en blanco entre grupos**

```typescript
// ❌ Error: falta línea en blanco
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// ✅ Correcto
import { useState } from 'react'

import { Button } from '@/components/ui/button'
```

3. **Imports duplicados**

```typescript
// ❌ Error: import duplicado
import { useState } from 'react'
import { useEffect } from 'react'

// ✅ Correcto
import { useEffect, useState } from 'react'
```

4. **Named imports desordenados**

```typescript
// ❌ Error: named imports sin orden alfabético
import { useState, useEffect, useMemo } from 'react'

// ✅ Correcto
import { useEffect, useMemo, useState } from 'react'
```

## 🛠️ Comandos Útiles

### Formatear automáticamente

```bash
pnpm prettier --write "src/**/*.{ts,tsx}"
```

### Fix automático de ESLint

```bash
pnpm lint --fix
```

### Verificar sin corregir

```bash
pnpm lint
```

## ⚙️ Configuración en `.prettierrc`

```json
{
  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrder": [
    "^(react|react-dom)$",
    "<THIRD_PARTY_MODULES>",
    "^@/components/(.*)$",
    "^@/lib/(.*)$",
    "^@/stores/(.*)$",
    "^@/modules/(.*)$",
    "^@/(.*)$",
    "^[./]"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,
  "importOrderCaseInsensitive": true
}
```

## 🎯 Configuración en ESLint

```javascript
'import/order': [
  'error',
  {
    groups: [
      'builtin',
      'external',
      'internal',
      ['parent', 'sibling'],
      'index',
      'object',
      'type',
    ],
    pathGroups: [
      { pattern: 'react', group: 'builtin', position: 'before' },
      { pattern: '@/components/**', group: 'internal' },
      { pattern: '@/lib/**', group: 'internal' },
      { pattern: '@/stores/**', group: 'internal' },
      { pattern: '@/modules/**', group: 'internal' },
    ],
    'newlines-between': 'always',
    alphabetize: { order: 'asc', caseInsensitive: true },
  },
],
'import/first': 'error',
'import/newline-after-import': 'error',
'import/no-duplicates': 'error',
```

## 📝 Tips y Mejores Prácticas

### 1. Type Imports

Usa `import type` para tipos TypeScript:

```typescript
import type { ReactElement } from 'react'

import type { Post } from '../../domain/entities/Post'
```

### 2. Default vs Named Imports

```typescript
// Default import
import React from 'react'
// Named imports (ordenados alfabéticamente)
import { useEffect, useMemo, useState } from 'react'
```

### 3. Alias de Path

Siempre usa el alias `@` para imports desde `src/`:

```typescript
// ✅ Correcto
import { Button } from '@/components/ui/button'

// ❌ Evitar
import { Button } from '../../../components/ui/button'
```

### 4. Barrel Exports

Usa barrel exports cuando sea posible:

```typescript
// ✅ Recomendado
import { formatDate, formatCurrency } from '@/lib/formatters'

// ❌ Evitar
import { formatDate } from '@/lib/formatters/date'
import { formatCurrency } from '@/lib/formatters/number'
```

## 🔒 Enforcement

El CI/CD fallará si:

- Los imports no están ordenados correctamente
- Falta línea en blanco entre grupos
- Hay imports duplicados
- Los named imports no están alfabéticamente ordenados

## 📚 Referencias

- [Prettier Plugin Sort Imports](https://github.com/trivago/prettier-plugin-sort-imports)
- [ESLint Plugin Import](https://github.com/import-js/eslint-plugin-import)
- [TypeScript Handbook - Modules](https://www.typescriptlang.org/docs/handbook/modules.html)

---

**⚡ Recuerda:** Ejecuta `pnpm prettier --write` y `pnpm lint --fix` antes de cada commit para asegurar que todos los imports estén correctamente ordenados.
