# ⚡ Environment Variables - Quick Start

## 🚀 Setup en 2 Pasos

### 1️⃣ Inicia el proyecto (Opcional: configurar .env)

```bash
# Opción A: Usar valores por defecto (funciona out-of-the-box)
pnpm dev

# Opción B: Personalizar configuración
cp .env.example .env.local
nano .env.local  # Edita tus valores
pnpm dev
```

### 2️⃣ Verificar configuración

✅ **Listo!** Deberías ver en la consola:

```
⚙️ App Configuration
Environment: development
Version: 1.0.0-dev
API URL: https://jsonplaceholder.typicode.com
DevTools: true
...
```

---

## 💻 Uso Básico

```typescript
import { config } from '@/config'

// Acceso type-safe a configuración
const apiUrl = config.api.baseUrl // "https://..."
const timeout = config.api.timeout // 10000
const appName = config.app.name // "Mi Aplicación"
const isDev = config.app.isDevelopment // true
const showDevTools = config.features.enableDevTools // true
```

---

## 📝 Variables Principales

| Variable                 | Descripción          | Default                                |
| ------------------------ | -------------------- | -------------------------------------- |
| `VITE_API_BASE_URL`      | URL de la API        | `https://jsonplaceholder.typicode.com` |
| `VITE_APP_NAME`          | Nombre de la app     | `Modern React App`                     |
| `VITE_ENABLE_DEVTOOLS`   | React Query DevTools | `true` (dev), `false` (prod)           |
| `VITE_ENABLE_DEBUG_LOGS` | Logs de debug        | `false`                                |
| `VITE_ITEMS_PER_PAGE`    | Items por página     | `9`                                    |

**Nota:** Todas las variables tienen valores por defecto. Solo necesitas crear `.env.local` si quieres personalizar algún valor.

---

## 🔍 Helpers Disponibles

```typescript
import {
  getEnvString,
  getEnvNumber,
  getEnvBoolean,
  getRequiredEnv,
} from '@/config'

// String
const name = getEnvString('VITE_APP_NAME', 'Default')

// Number
const timeout = getEnvNumber('VITE_API_TIMEOUT', 10000)

// Boolean (acepta: true, 1, yes, on)
const enabled = getEnvBoolean('VITE_ENABLE_DEVTOOLS', false)

// Required (lanza error si no existe)
const apiUrl = getRequiredEnv('VITE_API_BASE_URL')
```

---

## 📚 Más Información

- 📖 **Guía Completa**: [ENV_GUIDE.md](./ENV_GUIDE.md)
- 📋 **Resumen de Implementación**: [ENV_IMPLEMENTATION_SUMMARY.md](./ENV_IMPLEMENTATION_SUMMARY.md)
- 🔧 **Módulo de Config**: [src/config/README.md](./src/config/README.md)

---

## ⚠️ Importante

- ✅ **Siempre usa el prefijo `VITE_`** para variables del cliente
- ✅ **Nunca commitees `.env.local`** (ya está en .gitignore)
- ✅ **Usa el módulo `config`**, no accedas directamente a `import.meta.env`

---

## 🐛 Troubleshooting

### "Cannot find environment variable"

→ Reinicia el dev server: `Ctrl+C` y luego `pnpm dev`

### "Required variable missing"

→ Agrega `VITE_API_BASE_URL` a tu `.env.local`

### "TypeScript error"

→ Verifica que la variable esté en `src/vite-env.d.ts`

---

**¿Necesitas más detalles?** Consulta [ENV_GUIDE.md](./ENV_GUIDE.md) para documentación completa.
