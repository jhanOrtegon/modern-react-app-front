# Organización de Stores

Este documento explica la organización de los stores en la aplicación y las decisiones arquitecturales tomadas.

## Estructura de Stores

### ✅ Stores dentro de módulos (Recomendado)

Los stores que son **específicos de un módulo** deben vivir dentro de la carpeta `infrastructure/stores/` de ese módulo.

```
src/modules/
  └── auth/
      ├── infrastructure/
      │   └── stores/
      │       ├── authStore.ts      ← Store de autenticación
      │       └── index.ts           ← Barrel export
      └── presentation/
          └── hooks/
              └── useAuth.ts         ← Hook que usa authStore
```

**Ejemplo: authStore**

```typescript
// ✅ Importación desde dentro del módulo (rutas relativas)
import { useAuthStore } from '../../infrastructure/stores'

// ✅ Importación desde fuera del módulo (ruta absoluta)
import { useAuthStore } from '@/modules/auth/infrastructure/stores'
```

### 📦 Stores globales/compartidos

Los stores que son **transversales** (cross-cutting concerns) o que coordinan múltiples módulos pueden vivir en `src/stores/`.

```
src/stores/
  └── repositoryStore.ts  ← Store de configuración global
```

**Ejemplo: repositoryStore**

- Coordina la selección de repositorios entre Users y Posts
- Es infraestructura compartida de configuración
- No pertenece a un módulo específico

```typescript
// ✅ Importación desde cualquier lugar
import { useRepositoryStore } from '@/stores/repositoryStore'
```

## Criterios de decisión

### ¿Cuándo poner un store dentro de un módulo?

✅ **SÍ, dentro del módulo si:**

- Es específico de un módulo (ej: authStore para auth)
- Usa entidades/tipos del dominio de ese módulo
- Solo lo usa ese módulo o es su responsabilidad principal
- Sigue los principios de Clean Architecture y cohesión

### ¿Cuándo poner un store fuera (src/stores/)?

✅ **SÍ, fuera del módulo si:**

- Es un store de configuración global
- Coordina múltiples módulos (cross-cutting)
- Es infraestructura compartida (settings, theme, etc.)
- No pertenece al dominio de ningún módulo específico

## Beneficios de esta organización

### 1. **Cohesión del módulo**

- Todo lo relacionado con un módulo está junto
- Fácil de entender y mantener
- Reduce dependencias externas

### 2. **Separación de responsabilidades**

- Cada módulo maneja su propio estado
- Los stores globales son explícitamente globales
- Claridad en las dependencias

### 3. **Clean Architecture**

- Respeta los límites del módulo
- Infrastructure contiene detalles de implementación
- El store es un detalle de infraestructura

### 4. **Escalabilidad**

- Fácil agregar nuevos módulos con sus stores
- No contamina el directorio global de stores
- Permite mover/eliminar módulos completos

## Migración realizada

### authStore

**Antes:**

```
src/stores/authStore.ts
```

**Después:**

```
src/modules/auth/infrastructure/stores/
  ├── authStore.ts
  └── index.ts
```

### Archivos actualizados

Se actualizaron las importaciones en:

- ✅ `src/components/layout/AppLayout.tsx`
- ✅ `src/components/auth/PublicRoute.tsx`
- ✅ `src/components/auth/ProtectedRoute.tsx`
- ✅ `src/modules/users/presentation/hooks/useUserOperations.ts`
- ✅ `src/modules/auth/presentation/hooks/useLoginLogic.ts`
- ✅ `src/modules/auth/presentation/hooks/useRegisterLogic.ts`
- ✅ `src/modules/posts/presentation/hooks/usePostOperations.ts`

### Verificación

```bash
# Verificar que no hay errores
pnpm type-check  # ✅ Sin errores
pnpm lint        # ✅ Sin errores
```

## Ejemplo de uso

### Desde dentro del módulo de auth

```typescript
// Hook dentro de auth module
import { useAuthStore } from '../../infrastructure/stores'

export function useLoginLogic() {
  const setAuth = useAuthStore(state => state.setAuth)
  // ...
}
```

### Desde fuera del módulo de auth

```typescript
// Componente externo
import { useAuthStore } from '@/modules/auth/infrastructure/stores'

export function AppLayout() {
  const logout = useAuthStore(state => state.logout)
  // ...
}
```

## Recomendaciones

1. **Nuevos módulos**: Crea stores dentro de `infrastructure/stores/` si son específicos del módulo
2. **Stores globales**: Solo usa `src/stores/` para configuración global o coordinación multi-módulo
3. **Barrel exports**: Siempre crea un `index.ts` en la carpeta de stores para exports limpios
4. **Rutas absolutas**: Usa `@/modules/...` cuando importes desde fuera del módulo
5. **Rutas relativas**: Usa `../../infrastructure/stores` cuando importes desde dentro del módulo

## Conclusión

Esta organización respeta los principios de Clean Architecture y mantiene la cohesión de cada módulo, haciendo el código más mantenible y escalable a largo plazo.
