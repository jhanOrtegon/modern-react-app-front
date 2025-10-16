# 🔧 Configuration Module

Este directorio contiene la configuración centralizada de la aplicación, incluyendo el manejo de variables de entorno.

## 📁 Estructura

```
config/
├── index.ts          # Exportaciones centrales
└── env.ts            # Manejo de variables de entorno
```

## 🚀 Uso Rápido

```typescript
import { config } from '@/config'

// API Configuration
const apiUrl = config.api.baseUrl // string
const timeout = config.api.timeout // number

// App Information
const appName = config.app.name // string
const version = config.app.version // string
const isDev = config.app.isDevelopment // boolean

// Feature Flags
const showDevTools = config.features.enableDevTools // boolean
const debugLogs = config.features.enableDebugLogs // boolean

// UI Configuration
const itemsPerPage = config.ui.itemsPerPage // number
```

## 🛠️ Helpers Disponibles

```typescript
import {
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  getRequiredEnv,
  validateEnv,
  printConfig,
} from '@/config'

// Obtener variables con tipos específicos
const name = getEnvString('VITE_APP_NAME', 'Default')
const port = getEnvNumber('VITE_PORT', 3000)
const enabled = getEnvBoolean('VITE_FEATURE', false)

// Variable requerida (lanza error si no existe)
const apiKey = getRequiredEnv('VITE_API_KEY')

// Validar todas las variables requeridas
validateEnv()

// Imprimir configuración (solo en desarrollo)
printConfig()
```

## 📚 Documentación Completa

Para documentación detallada sobre variables de entorno, consulta:

📖 [ENV_GUIDE.md](../../ENV_GUIDE.md)

## ✅ Type Safety

Todas las variables están tipadas en `src/vite-env.d.ts`:

```typescript
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TIMEOUT: string
  readonly VITE_APP_NAME: string
  // ... más variables
}
```

## 🔒 Seguridad

- ✅ Solo variables con prefijo `VITE_` se exponen al cliente
- ✅ Validación automática de variables requeridas
- ✅ Type-safe access con TypeScript
- ✅ Valores por defecto para todas las opcionales
- ❌ Nunca expongas secrets sin el prefijo

## 🎯 Mejores Prácticas

1. **Siempre usa el módulo `config`**, nunca accedas directamente a `import.meta.env`
2. **Define tipos** para todas las variables en `vite-env.d.ts`
3. **Usa helpers** (`getEnvString`, `getEnvNumber`, etc.) para parsing seguro
4. **Valida al inicio** con `validateEnv()` en `main.tsx`
5. **Documenta** nuevas variables en `ENV_GUIDE.md`
