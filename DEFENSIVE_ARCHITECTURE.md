# Arquitectura Defensiva y Calidad de Código

## 📋 Resumen de Implementación

Este documento describe las mejoras de calidad, seguridad y robustez implementadas en el proyecto.

## 🛡️ Adaptadores Defensivos

### Problema Resuelto

- **Dependencia directa del backend**: El código estaba acoplado a la estructura exacta del API
- **Falta de validación**: No había protección contra datos mal formados
- **Errores en producción**: Valores undefined/null causaban crashes

### Solución: Patrón Adapter con Valores por Defecto

#### Ubicación de Adaptadores

```
src/modules/
  ├── posts/infrastructure/adapters/
  │   └── PostAdapter.ts
  └── users/infrastructure/adapters/
      └── UserAdapter.ts
```

#### Características de los Adaptadores

**1. Transformación Segura de Datos**

```typescript
// Antes (peligroso)
const posts: Post[] = await response.json() as Post[]

// Después (seguro)
const data: unknown = await response.json()
const posts = PostAdapter.toDomainList(data as unknown[])
```

**2. Valores por Defecto**

- Si falta un campo → se usa valor por defecto
- Si el tipo es incorrecto → se parsea o se usa default
- Si es null/undefined → valor por defecto seguro

**3. Funciones de Parseo Defensivas**

```typescript
parseNumber(value: unknown, defaultValue: number): number
  - Valida que sea número
  - Intenta parsear strings
  - Retorna default si falla

parseString(value: unknown, defaultValue: string): string
  - Valida que sea string
  - Maneja null/undefined
  - Solo convierte tipos primitivos seguros
```

**4. Desacoplamiento del Backend**

```typescript
// La app NO depende de las llaves exactas del API
interface PostAPIResponse {
  id?: unknown      // Puede no existir
  title?: unknown   // Tipo desconocido
  [key: string]: unknown  // Acepta cualquier clave extra
}
```

### Beneficios

✅ **Robustez**: La app no se rompe si el backend cambia
✅ **Seguridad de Tipos**: TypeScript valida todo
✅ **Mantenibilidad**: Un solo lugar para adaptar cambios del API
✅ **Testeable**: Fácil mockear y testear adaptadores
✅ **Escalable**: Agregar nuevas entidades es simple

## 🔒 Reglas Estrictas de ESLint

### Configuración Implementada

#### 1. No Console.log (ERROR)

```javascript
'no-console': 'error'  // Antes: 'warn'
```

**Razón**: Console.log en producción:

- Expone información sensible
- Degrada performance
- No es apropiado para logging profesional

**Alternativa**: Usar sistema de logging apropiado (winston, pino, etc.)

#### 2. Tipado Explícito Obligatorio

```javascript
'@typescript-eslint/explicit-function-return-type': 'error'
'@typescript-eslint/explicit-module-boundary-types': 'error'
```

**Antes (permitido)**

```typescript
function getUser(id) {  // ❌ Sin tipos
  return fetch(`/users/${id}`)
}
```

**Después (obligatorio)**

```typescript
function getUser(id: number): Promise<User> {  // ✅ Tipado completo
  return fetch(`/users/${id}`)
}
```

#### 3. No Any Permitido

```javascript
'@typescript-eslint/no-explicit-any': 'error'
```

- Prohibe `any` en todo el código
- Fuerza uso de `unknown` cuando no se conoce el tipo
- Requiere validación explícita antes de usar

#### 4. Seguridad de Tipos Strict

```javascript
'@typescript-eslint/no-unsafe-assignment': 'error'
'@typescript-eslint/no-unsafe-member-access': 'error'
'@typescript-eslint/no-unsafe-call': 'error'
'@typescript-eslint/no-unsafe-return': 'error'
'@typescript-eslint/no-unsafe-argument': 'error'
```

Previene operaciones no seguras con tipos desconocidos.

#### 5. Template Literals Estrictos

```javascript
'@typescript-eslint/restrict-template-expressions': 'error'
```

**Antes (permitido)**

```typescript
const url = `/users/${user}`  // ❌ user puede ser objeto
```

**Después (obligatorio)**

```typescript
const url = `/users/${String(user.id)}`  // ✅ Conversión explícita
```

## 🔗 Pre-commit Hooks con Husky

### Flujo de Validación Antes de Commit

```bash
1. git add .
2. git commit -m "mensaje"
3. 🤖 Pre-commit hook se ejecuta:
   ├── lint-staged
   │   ├── ESLint (fix automático)
   │   ├── Prettier (format)
   │   └── TypeScript type-check
   └── Build completo (pnpm build)
4. ❌ Si hay errores → commit rechazado
5. ✅ Si todo pasa → commit permitido
```

### Configuración `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run lint-staged (linting, formatting, type-check)
npx lint-staged

# Run build to ensure no build errors
echo "Running build to ensure no errors..."
pnpm build

# If build succeeds, continue with commit
echo "✅ All checks passed!"
```

### Configuración `lint-staged`

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix --max-warnings 0", // Cero warnings permitidos
      "prettier --write",
      "bash -c 'pnpm type-check'" // Type-check completo
    ]
  }
}
```

### Beneficios

✅ **Calidad Garantizada**: Solo código sin errores llega al repo
✅ **Build Verificado**: Garantiza que la app compila
✅ **Estilo Consistente**: Prettier asegura formato uniforme
✅ **Prevención de Bugs**: Detecta errores antes del commit
✅ **CI/CD Optimization**: Menos builds fallidos en CI

## 📊 Comparación Antes vs Después

### Antes

```typescript
// ❌ Sin adaptador - peligroso
async findAll(): Promise<Post[]> {
  const response = await fetch('/posts')
  return await response.json()  // Cualquier cosa puede venir
}

// ❌ Sin tipado
function getUser(id) {
  console.log('Fetching user')  // Console.log en producción
  return fetch(`/users/${id}`)
}
```

### Después

```typescript
// ✅ Con adaptador - seguro
async findAll(): Promise<Post[]> {
  try {
    const response = await fetch('/posts')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: unknown = await response.json()
    return PostAdapter.toDomainList(data as unknown[])
  } catch (error) {
    throw new Error(`Failed to fetch posts: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// ✅ Completamente tipado
function getUser(id: number): Promise<User> {
  // Logger profesional en lugar de console.log
  return fetch(`/users/${String(id)}`)
}
```

## 🎯 Mejores Prácticas Implementadas

### 1. Defensive Programming

- Siempre validar datos externos
- Usar valores por defecto
- Nunca asumir estructura de datos

### 2. Type Safety

- Todo debe estar tipado
- Evitar `any` a toda costa
- Usar `unknown` para datos externos

### 3. Error Handling

- Try-catch en operaciones I/O
- Mensajes de error descriptivos
- Logging apropiado (no console.log)

### 4. Code Quality

- ESLint estricto
- Pre-commit validation
- Build antes de commit

### 5. Separation of Concerns

- Adaptadores en capa de infraestructura
- Lógica de negocio en dominio
- Validación en adaptadores

## 🚀 Cómo Usar

### Desarrollar con las Nuevas Reglas

```bash
# Desarrollo normal
pnpm dev

# Fix automático de ESLint
pnpm lint:fix

# Type-check manual
pnpm type-check

# Build manual
pnpm build
```

### Al Hacer Commit

```bash
# 1. Agregar cambios
git add .

# 2. Intentar commit
git commit -m "feat: add new feature"

# 3. Si hay errores, corregirlos y reintentar
# El hook NO permitirá el commit si hay:
# - Errores de ESLint
# - Errores de TypeScript
# - Errores de Build

# 4. Una vez corregido todo
git commit -m "feat: add new feature"
# ✅ Commit exitoso!
```

## 📖 Recursos Adicionales

- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [ESLint TypeScript Rules](https://typescript-eslint.io/rules/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Adapter Pattern](https://refactoring.guru/design-patterns/adapter)

## 🎉 Resultado Final

### Arquitectura Robusta

- ✅ Adaptadores defensivos
- ✅ Valores por defecto
- ✅ Desacoplamiento del backend

### Calidad de Código

- ✅ No console.log
- ✅ Tipado completo y estricto
- ✅ Cero warnings

### Proceso de Commit

- ✅ Lint automático
- ✅ Type-check obligatorio
- ✅ Build verificado
- ✅ Solo código de calidad en el repo
