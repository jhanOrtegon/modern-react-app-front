# 🌐 Environment Variables Guide

## 📋 Tabla de Contenidos

- [Introducción](#introducción)
- [Estructura de Archivos](#estructura-de-archivos)
- [Variables Disponibles](#variables-disponibles)
- [Uso en el Código](#uso-en-el-código)
- [Mejores Prácticas](#mejores-prácticas)
- [Ejemplos Prácticos](#ejemplos-prácticos)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción

Este proyecto usa **Vite** para manejar variables de entorno de forma segura y eficiente. Todas las variables expuestas al cliente deben tener el prefijo `VITE_` por seguridad.

### ¿Por qué el prefijo VITE\_?

Vite **solo expone** variables que empiezan con `VITE_` al código del cliente. Esto previene la exposición accidental de secretos (API keys, tokens, etc.) en el bundle final.

---

## 📁 Estructura de Archivos

```
modern-react-app/
├── .env                      # ⚠️ Base (commitear con valores placeholder)
├── .env.example             # ✅ Template (commitear siempre)
├── .env.development         # ✅ Desarrollo (commitear)
├── .env.production          # ✅ Producción (commitear)
├── .env.local               # ❌ Local overrides (NO commitear)
├── .env.development.local   # ❌ Dev local (NO commitear)
└── .env.production.local    # ❌ Prod local (NO commitear)
```

### Prioridad de Carga (de mayor a menor)

1. `.env.[mode].local` (ej: `.env.development.local`)
2. `.env.local`
3. `.env.[mode]` (ej: `.env.development`)
4. `.env`

**Modo** se determina por `--mode` o por defecto:

- `pnpm dev` → `development`
- `pnpm build` → `production`

---

## 🔧 Variables Disponibles

### 🌐 API Configuration

| Variable            | Tipo     | Default    | Descripción        |
| ------------------- | -------- | ---------- | ------------------ |
| `VITE_API_BASE_URL` | `string` | _required_ | URL base de la API |
| `VITE_API_TIMEOUT`  | `number` | `10000`    | Timeout en ms      |

### 📱 App Information

| Variable           | Tipo     | Default            | Descripción      |
| ------------------ | -------- | ------------------ | ---------------- |
| `VITE_APP_NAME`    | `string` | `Modern React App` | Nombre de la app |
| `VITE_APP_VERSION` | `string` | `1.0.0`            | Versión actual   |
| `VITE_APP_ENV`     | `string` | `development`      | Entorno          |

### 🔍 Feature Flags

| Variable                             | Tipo      | Default      | Descripción          |
| ------------------------------------ | --------- | ------------ | -------------------- |
| `VITE_ENABLE_DEVTOOLS`               | `boolean` | `true (dev)` | React Query DevTools |
| `VITE_ENABLE_DEBUG_LOGS`             | `boolean` | `false`      | Logs de debug        |
| `VITE_ENABLE_PERFORMANCE_MONITORING` | `boolean` | `false`      | Web Vitals           |

### 📊 Analytics (Opcional)

| Variable              | Tipo     | Default | Descripción         |
| --------------------- | -------- | ------- | ------------------- |
| `VITE_GA_TRACKING_ID` | `string` | `''`    | Google Analytics ID |
| `VITE_SENTRY_DSN`     | `string` | `''`    | Sentry DSN          |

### 🎨 UI Configuration

| Variable               | Tipo     | Default | Descripción      |
| ---------------------- | -------- | ------- | ---------------- |
| `VITE_ITEMS_PER_PAGE`  | `number` | `9`     | Items por página |
| `VITE_SEARCH_DEBOUNCE` | `number` | `300`   | Debounce en ms   |

---

## 💻 Uso en el Código

### ❌ **MAL** - Acceso directo

```typescript
// NO hagas esto - sin type safety, sin defaults
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### ✅ **BIEN** - Usando el módulo `config/env`

```typescript
import { config } from '@/config/env'

// Type-safe, con defaults y validación
const apiUrl = config.api.baseUrl
const timeout = config.api.timeout
const isDev = config.app.isDevelopment
```

### Helpers Disponibles

```typescript
import {
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  getRequiredEnv,
} from '@/config/env'

// String con default
const name = getEnvString('VITE_APP_NAME', 'My App')

// Number con parsing automático
const timeout = getEnvNumber('VITE_API_TIMEOUT', 5000)

// Boolean (acepta: true, 1, yes, on)
const enabled = getEnvBoolean('VITE_ENABLE_DEVTOOLS', false)

// Required (lanza error si no existe)
const apiUrl = getRequiredEnv('VITE_API_BASE_URL')
```

---

## 🎯 Mejores Prácticas

### ✅ DO

1. **Usa el módulo `config/env`** para todo acceso a variables
2. **Commitea `.env.example`** actualizado siempre
3. **Usa `.env.local`** para secrets personales
4. **Prefija con `VITE_`** todas las variables
5. **Documenta nuevas variables** en este archivo
6. **Valida variables requeridas** al inicio

```typescript
// En main.tsx
import { validateEnv, printConfig } from '@/config/env'

validateEnv() // Lanza error si faltan variables requeridas
printConfig() // Debug en desarrollo
```

### ❌ DON'T

1. **NO commitees** archivos `.env.local`
2. **NO expongas** secrets sin el prefijo `VITE_`
3. **NO uses** valores hardcodeados, usa `.env`
4. **NO accedas** directamente a `import.meta.env`
5. **NO olvides** actualizar TypeScript types en `vite-env.d.ts`

---

## 📚 Ejemplos Prácticos

### Ejemplo 1: Configurar API Client

```typescript
// src/lib/api/client.ts
import axios from 'axios'
import { config } from '@/config/env'

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Ejemplo 2: Feature Flags

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { config } from '@/config/env'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {config.features.enableDevTools && <ReactQueryDevtools />}
    </QueryClientProvider>
  </StrictMode>
)
```

### Ejemplo 3: Conditional Logging

```typescript
// src/lib/logger/Logger.ts
import { config } from '@/config/env'

export class Logger {
  debug(message: string, ...args: unknown[]): void {
    if (config.features.enableDebugLogs) {
      console.log(`[DEBUG] ${message}`, ...args)
    }
  }
}
```

### Ejemplo 4: Analytics Initialization

```typescript
// src/lib/analytics/init.ts
import { config } from '@/config/env'

export function initAnalytics(): void {
  if (config.analytics.gaTrackingId) {
    // Inicializar Google Analytics
    gtag('config', config.analytics.gaTrackingId)
  }

  if (config.analytics.sentryDsn) {
    // Inicializar Sentry
    Sentry.init({ dsn: config.analytics.sentryDsn })
  }
}
```

---

## 🚀 Setup Rápido

### 1. Copia el template

```bash
cp .env.example .env.local
```

### 2. Edita tus valores

```bash
# .env.local
VITE_API_BASE_URL=https://tu-api.com
VITE_APP_NAME=Mi App Custom
```

### 3. Inicia el proyecto

```bash
pnpm dev
```

---

## 🐛 Troubleshooting

### ❓ "Cannot find environment variable"

**Problema:** La variable no existe o no tiene el prefijo `VITE_`

**Solución:**

1. Verifica que la variable esté en `.env.local` o `.env.development`
2. Asegúrate de que empiece con `VITE_`
3. Reinicia el servidor de desarrollo

```bash
# Detén el servidor
Ctrl + C

# Inicia de nuevo
pnpm dev
```

### ❓ "Variable is undefined in production"

**Problema:** La variable solo está en `.env.development`

**Solución:**
Agrega la variable a `.env.production` o `.env`:

```bash
# .env.production
VITE_API_BASE_URL=https://api.production.com
```

### ❓ "TypeScript error: Property does not exist"

**Problema:** Falta agregar la variable a `vite-env.d.ts`

**Solución:**
Edita `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_MI_NUEVA_VARIABLE: string
}
```

### ❓ "Required variable missing"

**Problema:** `validateEnv()` lanza error

**Solución:**
Agrega la variable requerida a tu `.env.local`:

```bash
# .env.local
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
```

---

## 🔒 Seguridad

### ⚠️ NUNCA expongas:

- API Keys privadas
- Tokens de autenticación
- Passwords
- Private keys
- Secretos del backend

### ✅ Solo expón:

- URLs públicas
- Feature flags
- Configuración de UI
- IDs públicos (Google Analytics, etc.)

### 🛡️ Regla de oro:

> **Si no quieres que esté en el bundle final visible al usuario, NO uses el prefijo `VITE_`**

---

## 📝 Agregar Nueva Variable

### 1. Define en `.env.example`

```bash
# .env.example
# 🔧 Mi Nueva Feature
VITE_MI_NUEVA_CONFIG=default_value
```

### 2. Agrega tipo en `vite-env.d.ts`

```typescript
interface ImportMetaEnv {
  readonly VITE_MI_NUEVA_CONFIG: string
}
```

### 3. Usa en `config/env.ts`

```typescript
export const miConfig = {
  nuevaConfig: getEnvString('VITE_MI_NUEVA_CONFIG', 'default'),
} as const
```

### 4. Documenta en este archivo

Agrega una nueva fila a la tabla de [Variables Disponibles](#variables-disponibles)

---

## 📚 Referencias

- [Vite Env Variables Docs](https://vitejs.dev/guide/env-and-mode.html)
- [TypeScript Environment](https://vitejs.dev/guide/env-and-mode.html#intellisense-for-typescript)
- [dotenv Documentation](https://github.com/motdotla/dotenv)

---

## ✅ Checklist de Deployment

Antes de hacer deploy a producción:

- [ ] Todas las variables están en `.env.production`
- [ ] `.env.local` está en `.gitignore`
- [ ] `validateEnv()` pasa exitosamente
- [ ] No hay secrets expuestos con prefijo `VITE_`
- [ ] TypeScript types actualizados en `vite-env.d.ts`
- [ ] `.env.example` está actualizado
- [ ] Documentación actualizada en este archivo

---

**¿Preguntas?** Revisa la sección de [Troubleshooting](#troubleshooting) o consulta a tu equipo.
