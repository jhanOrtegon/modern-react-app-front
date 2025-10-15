# Funciones Utilitarias

Este directorio contiene funciones utilitarias reutilizables para la aplicación.

## 📁 Estructura

```
lib/
├── formatters/         # Funciones de formateo
│   ├── date.ts        # Formateo de fechas
│   ├── number.ts      # Formateo de números y monedas
│   ├── string.ts      # Manipulación de strings
│   └── index.ts       # Barrel export
├── validators/        # Funciones de validación
│   └── index.ts       # Validaciones comunes
├── errors/           # Sistema de errores personalizados
│   ├── DomainError.ts           # Errores de dominio
│   ├── handleRepositoryError.ts # Handler de errores de repo
│   └── index.ts                 # Barrel export
├── logger/           # Sistema de logging
│   ├── Logger.ts     # Logger centralizado
│   └── index.ts      # Barrel export
├── query-keys.ts     # Factory de query keys (React Query)
└── utils.ts          # Utilidades generales (Tailwind merge)
```

## 🗓️ Formateo de Fechas (`formatters/date.ts`)

### `formatDate(date: Date | string | number): string`

Formatea una fecha en formato corto (dd/MM/yyyy).

```typescript
formatDate(new Date()) // "15/10/2025"
```

### `formatDateTime(date: Date | string | number): string`

Formatea una fecha con hora (dd/MM/yyyy HH:mm).

```typescript
formatDateTime(new Date()) // "15/10/2025 14:30"
```

### `formatRelativeTime(date: Date | string | number): string`

Formatea una fecha de forma relativa.

```typescript
formatRelativeTime(new Date(Date.now() - 60000)) // "hace 1 minuto"
```

### `formatLongDate(date: Date | string | number): string`

Formatea una fecha en formato largo.

```typescript
formatLongDate(new Date()) // "15 de octubre de 2025"
```

### `getDaysDifference(date1, date2): number`

Obtiene la diferencia en días entre dos fechas.

```typescript
getDaysDifference(new Date(), new Date(Date.now() + 86400000)) // 1
```

## 🔢 Formateo de Números (`formatters/number.ts`)

### `formatNumber(value: number, decimals?: number): string`

Formatea un número con separadores de miles.

```typescript
formatNumber(1234567.89) // "1,234,568"
formatNumber(1234567.89, 2) // "1,234,567.89"
```

### `formatCurrency(value: number, currency?: string): string`

Formatea un número como moneda.

```typescript
formatCurrency(1234.56) // "$1,234.56"
formatCurrency(1234.56, 'EUR') // "€1,234.56"
```

### `formatPercent(value: number, decimals?: number): string`

Formatea un número como porcentaje.

```typescript
formatPercent(0.1234) // "12%"
formatPercent(0.1234, 2) // "12.34%"
```

### `formatFileSize(bytes: number, decimals?: number): string`

Formatea un tamaño de archivo.

```typescript
formatFileSize(1024) // "1.00 KB"
formatFileSize(1048576) // "1.00 MB"
```

### `formatCompactNumber(value: number): string`

Formatea un número con notación compacta.

```typescript
formatCompactNumber(1234567) // "1.2M"
formatCompactNumber(1234) // "1.2K"
```

### `roundNumber(value: number, decimals: number): number`

Redondea un número a los decimales especificados.

```typescript
roundNumber(1.2345, 2) // 1.23
```

## 📝 Manipulación de Strings (`formatters/string.ts`)

### `capitalize(str: string): string`

Capitaliza la primera letra.

```typescript
capitalize('hello world') // "Hello world"
```

### `capitalizeWords(str: string): string`

Capitaliza cada palabra.

```typescript
capitalizeWords('hello world') // "Hello World"
```

### `truncate(str: string, maxLength: number, suffix?: string): string`

Trunca un string.

```typescript
truncate('Hello World', 8) // "Hello..."
```

### `slugify(str: string): string`

Convierte a slug (URL-friendly).

```typescript
slugify('Hello World!') // "hello-world"
```

### `toCamelCase(str: string): string`

Convierte a camelCase.

```typescript
toCamelCase('hello world') // "helloWorld"
```

### `toSnakeCase(str: string): string`

Convierte a snake_case.

```typescript
toSnakeCase('helloWorld') // "hello_world"
```

### `getInitials(name: string, maxInitials?: number): string`

Extrae iniciales de un nombre.

```typescript
getInitials('John Doe') // "JD"
```

### `maskString(str: string, start: number, end: number, mask?: string): string`

Enmascara parte de un string.

```typescript
maskString('1234567890', 4, 8) // "1234****90"
```

## ✅ Validaciones (`validators/index.ts`)

### Validación de Formatos

- `isValidEmail(email: string): boolean` - Valida email
- `isValidUrl(url: string): boolean` - Valida URL
- `isValidPhone(phone: string): boolean` - Valida teléfono
- `isValidDate(date: unknown): boolean` - Valida fecha

### Validación de Tipos

- `isEmpty(str: string): boolean` - Verifica si está vacío
- `isValidNumber(value: unknown): value is number` - Valida número
- `isAlpha(str: string): boolean` - Solo letras
- `isNumeric(str: string): boolean` - Solo números
- `isAlphanumeric(str: string): boolean` - Letras y números

### Validación de Rangos

- `hasMinLength(str: string, minLength: number): boolean` - Longitud mínima
- `hasMaxLength(str: string, maxLength: number): boolean` - Longitud máxima
- `isInRange(value: number, min: number, max: number): boolean` - Rango numérico

## 🎯 Uso en Componentes

```typescript
import { formatDate, formatCurrency } from '@/lib/formatters'
import { isValidEmail } from '@/lib/validators'

function MyComponent() {
  const date = formatDate(new Date())
  const price = formatCurrency(1234.56)
  const isValid = isValidEmail('test@example.com')

  return (
    <div>
      <p>Fecha: {date}</p>
      <p>Precio: {price}</p>
      <p>Email válido: {isValid ? 'Sí' : 'No'}</p>
    </div>
  )
}
```

## ⚠️ Manejo de Errores

Todas las funciones lanzan errores descriptivos cuando reciben valores inválidos:

```typescript
try {
  formatDate('invalid-date')
} catch (error) {
  console.error(error.message) // "Invalid date provided"
}
```

## 🔧 Extensibilidad

Para agregar nuevas utilidades:

1. Crea la función en el archivo correspondiente
2. Agrega documentación JSDoc
3. Incluye ejemplos de uso
4. Agrega validación de entrada
5. Exporta en el `index.ts` correspondiente
6. Actualiza esta documentación

## 📦 Imports Optimizados

Gracias a los barrel exports, puedes importar todo desde un solo lugar:

```typescript
// ✅ Recomendado
import { formatDate, formatCurrency, isValidEmail } from '@/lib/formatters'
import { DomainError, ValidationError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { queryKeys } from '@/lib/query-keys'

// ❌ Evitar
import { formatDate } from '@/lib/formatters/date'
import { formatCurrency } from '@/lib/formatters/number'
```

## 🚨 Sistema de Errores (`errors/`)

### Errores de Dominio

```typescript
import { ValidationError, NotFoundError, UnauthorizedError } from '@/lib/errors'

// Lanzar error de validación
throw new ValidationError('El email no es válido', 'email')

// Lanzar error de recurso no encontrado
throw new NotFoundError('Post', 123)

// Lanzar error de autorización
throw new UnauthorizedError('Debes iniciar sesión')
```

### Handler de Errores de Repositorio

```typescript
import { handleRepositoryError } from '@/lib/errors'

try {
  const data = await fetch('/api/posts')
} catch (error) {
  handleRepositoryError(error, 'obtener posts')
}
```

## 📊 Logger Centralizado (`logger/`)

```typescript
import { logger } from '@/lib/logger'

// Logs con niveles
logger.debug('Datos de debug', { userId: 123 })
logger.info('Usuario creado', { module: 'users', userId: 123 })
logger.warn('Operación lenta', { duration: 5000 })
logger.error('Error al crear post', error, { module: 'posts' })
```

## 🔑 Query Keys Factory (`query-keys.ts`)

```typescript
import { queryKeys } from '@/lib/query-keys'
import { useQuery } from '@tanstack/react-query'

// Usar en queries
const { data } = useQuery({
  queryKey: queryKeys.posts.list(accountId),
  queryFn: () => getPostsUseCase.execute(accountId),
})

// Invalidar cache
queryClient.invalidateQueries({ queryKey: queryKeys.posts.all })
```

```

```
