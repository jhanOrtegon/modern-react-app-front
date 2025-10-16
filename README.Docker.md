# 🐳 Docker Setup - Modern React App

Documentación completa para ejecutar el proyecto con Docker.

## 📋 Prerequisitos

- Docker Desktop instalado
- Docker Compose v2.0+
- (Opcional) Make para usar comandos simplificados

## 🚀 Modo Desarrollo

### Opción 1: Con Make (Recomendado)

```bash
# Iniciar servidor de desarrollo
make dev

# Ver logs
make logs

# Acceder al contenedor
make shell

# Detener
make down
```

### Opción 2: Con Docker Compose

```bash
# Iniciar servidor de desarrollo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

La app estará disponible en: **http://localhost:5173**

### ✨ Características del modo desarrollo:

- ✅ Hot Module Replacement (HMR)
- ✅ Sincronización de archivos con volúmenes
- ✅ Variables de entorno desde `.env.development.local`
- ✅ Puerto 5173 expuesto

## 📦 Modo Producción

### Con Make:

```bash
# Build de la imagen
make build

# Iniciar servidor de producción
make prod

# Ver logs
make prod-logs

# Detener
make down
```

### Con Docker Compose:

```bash
# Build
docker-compose -f docker-compose.prod.yml build

# Iniciar
docker-compose -f docker-compose.prod.yml up -d

# Detener
docker-compose -f docker-compose.prod.yml down
```

La app estará disponible en: **http://localhost**

### ✨ Características del modo producción:

- ✅ Build optimizado con Vite
- ✅ Servido por Nginx
- ✅ Compresión Gzip
- ✅ Cache de assets estáticos
- ✅ Routing con fallback a index.html

## 🛠️ Comandos útiles

### Reconstruir imagen (forzar)

```bash
docker-compose build --no-cache
```

### Ver logs en tiempo real

```bash
docker-compose logs -f modern-react-app
```

### Acceder al shell del contenedor

```bash
docker-compose exec modern-react-app sh
```

### Limpiar todo (contenedores, imágenes, volúmenes)

```bash
make clean
# o
docker-compose down -v --rmi all
```

### Reiniciar contenedor

```bash
make restart
# o
docker-compose restart
```

## 📁 Estructura de archivos Docker

```
.
├── Dockerfile                  # Multi-stage build
├── docker-compose.yml          # Desarrollo
├── docker-compose.prod.yml     # Producción
├── nginx.conf                  # Configuración Nginx
├── .dockerignore              # Archivos ignorados
├── Makefile                   # Comandos simplificados
└── .env.development.local     # Variables de entorno
```

## 🔧 Configuración de Variables de Entorno

Las variables se cargan desde `.env.development.local`:

```env
VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_NAME=Modern React App
VITE_ENABLE_DEVTOOLS=true
```

Para producción, crea un archivo `.env.production.local` (no incluido en git).

## 🐛 Troubleshooting

### El puerto 5173 ya está en uso

```bash
# Encontrar proceso
lsof -i :5173  # Mac/Linux
netstat -ano | findstr :5173  # Windows

# Cambiar puerto en docker-compose.yml
ports:
  - "3000:5173"  # Usa puerto 3000 en tu máquina
```

### Hot reload no funciona

Asegúrate de tener la configuración correcta en `vite.config.ts`:

```typescript
server: {
  watch: {
    usePolling: true,
  },
  host: true,
  strictPort: true,
  port: 5173,
}
```

### Cambios no se reflejan

```bash
# Reconstruir sin cache
docker-compose build --no-cache
docker-compose up -d
```

### Permisos en Linux

```bash
# Si tienes problemas de permisos
sudo chown -R $USER:$USER .
```

## 📊 Arquitectura Multi-Stage

El `Dockerfile` usa multi-stage build para optimizar:

1. **base**: Instala pnpm y prepara dependencias
2. **development**: Copia todo y ejecuta dev server
3. **production-deps**: Solo dependencias de producción
4. **build**: Construye assets optimizados
5. **production**: Nginx sirviendo assets estáticos

## 🎯 Best Practices

- ✅ Usa `.dockerignore` para reducir tamaño de contexto
- ✅ Volúmenes anónimos para `node_modules`
- ✅ Multi-stage builds para imágenes pequeñas
- ✅ Nginx para servir en producción
- ✅ Variables de entorno para configuración

## 📝 Notas

- El modo desarrollo monta el código como volumen (cambios en vivo)
- El modo producción crea un build estático optimizado
- Nginx sirve la app con routing correcto para SPA
- Los logs se pueden ver con `docker-compose logs -f`

## 🆘 Ayuda

Para ver todos los comandos disponibles:

```bash
make help
```

## 🔗 Referencias

- [Docker Documentation](https://docs.docker.com/)
- [Vite Docker Guide](https://vitejs.dev/guide/build.html#docker)
- [Nginx Documentation](https://nginx.org/en/docs/)
