# 🏗️ Arquitectura Modular - Modern React App

## 📂 Estructura de Módulos

La aplicación está organizada en **módulos independientes** siguiendo el patrón de **Arquitectura Hexagonal** (Clean Architecture). Cada módulo es completamente autónomo y desacoplado.

```
src/
├── modules/                          # Módulos de la aplicación
│   ├── posts/                       # Módulo de Posts
│   │   ├── domain/                  # Lógica de negocio de Posts
│   │   │   ├── entities/
│   │   │   │   └── Post.ts         # Entidad Post + DTOs
│   │   │   └── repositories/
│   │   │       └── IPostRepository.ts  # Interface del repositorio
│   │   │
│   │   ├── application/             # Casos de uso de Posts
│   │   │   └── use-cases/
│   │   │       ├── CreatePostUseCase.ts
│   │   │       ├── DeletePostUseCase.ts
│   │   │       ├── GetPostUseCase.ts
│   │   │       ├── GetPostsUseCase.ts
│   │   │       └── UpdatePostUseCase.ts
│   │   │
│   │   ├── infrastructure/          # Adaptadores de Posts
│   │   │   └── repositories/
│   │   │       └── JsonPlaceholderPostRepository.ts
│   │   │
│   │   ├── presentation/            # UI de Posts
│   │   │   ├── components/
│   │   │   │   ├── PostList.tsx
│   │   │   │   ├── PostDetail.tsx
│   │   │   │   └── PostForm.tsx
│   │   │   └── hooks/
│   │   │       └── usePostOperations.ts
│   │   │
│   │   └── di/                      # DI Container de Posts
│   │       └── PostsContainer.ts
│   │
│   └── users/                       # Módulo de Users
│       ├── domain/
│       │   ├── entities/
│       │   │   └── User.ts
│       │   └── repositories/
│       │       └── IUserRepository.ts
│       │
│       ├── application/
│       │   └── use-cases/
│       │       ├── CreateUserUseCase.ts
│       │       ├── DeleteUserUseCase.ts
│       │       ├── GetUserUseCase.ts
│       │       ├── GetUsersUseCase.ts
│       │       └── UpdateUserUseCase.ts
│       │
│       ├── infrastructure/
│       │   └── repositories/
│       │       └── JsonPlaceholderUserRepository.ts
│       │
│       ├── presentation/
│       │   ├── components/
│       │   │   ├── UserList.tsx
│       │   │   ├── UserDetail.tsx
│       │   │   └── UserForm.tsx
│       │   └── hooks/
│       │       └── useUserOperations.ts
│       │
│       └── di/
│           └── UsersContainer.ts
│
├── components/                      # Componentes compartidos
│   ├── layout/
│   │   └── AppLayout.tsx           # Layout con navegación
│   └── ui/                         # Componentes UI (shadcn/ui)
│       └── button.tsx
│
├── router/                         # Configuración de rutas
│   └── index.tsx                  # Router con lazy loading modular
│
└── lib/                           # Utilidades compartidas
    └── utils.ts

```

## 🎯 Principios de la Arquitectura Modular

### 1. **Módulos Independientes**

Cada módulo (`posts`, `users`) es completamente autónomo:

- ✅ Tiene su propia lógica de dominio
- ✅ Tiene sus propios casos de uso
- ✅ Tiene su propio repositorio
- ✅ Tiene su propio DI container
- ✅ Tiene su propia presentación

### 2. **Bajo Acoplamiento**

- Los módulos NO se importan entre sí
- Cada módulo puede ser removido sin afectar otros
- Los componentes compartidos están en `/components`
- Las utilidades compartidas están en `/lib`

### 3. **Alta Cohesión**

- Todo lo relacionado con Posts está en `/modules/posts`
- Todo lo relacionado con Users está en `/modules/users`
- Fácil de encontrar y mantener código

### 4. **Escalabilidad**

```bash
# Agregar un nuevo módulo es simple:
src/modules/
  └── comments/              # Nuevo módulo
      ├── domain/
      ├── application/
      ├── infrastructure/
      ├── presentation/
      └── di/
```

## 🚀 Ventajas de esta Arquitectura

### ✨ **Separación Clara**

```
modules/posts/     → Todo sobre Posts
modules/users/     → Todo sobre Users
components/        → UI compartida
router/            → Configuración de rutas
```

### 🔧 **Mantenimiento Fácil**

- Bug en Posts? → Ve a `modules/posts/`
- Nueva feature de Users? → Ve a `modules/users/`
- No hay archivos mezclados ni código enredado

### 📦 **Testing Modular**

```typescript
// Test solo el módulo Posts
describe('Posts Module', () => {
  // Tests aislados
})

// Test solo el módulo Users
describe('Users Module', () => {
  // Tests aislados
})
```

### 🔄 **Reusabilidad**

- Los módulos pueden ser reutilizados en otros proyectos
- Copia la carpeta `modules/posts/` → Listo!
- Cada módulo es un "micro-aplicación"

### 👥 **Trabajo en Equipo**

```
Developer A → Trabaja en modules/posts/
Developer B → Trabaja en modules/users/
Developer C → Trabaja en modules/comments/

Sin conflictos, sin pisarse entre sí
```

## 🔄 Flujo de Datos por Módulo

### Módulo Posts

```
PostList.tsx
    ↓ (usa)
usePostOperations.ts
    ↓ (llama)
PostsContainer
    ↓ (obtiene)
GetPostsUseCase
    ↓ (usa)
IPostRepository (interface)
    ↓ (implementa)
JsonPlaceholderPostRepository
    ↓
API JSONPlaceholder
```

### Módulo Users

```
UserList.tsx
    ↓ (usa)
useUserOperations.ts
    ↓ (llama)
UsersContainer
    ↓ (obtiene)
GetUsersUseCase
    ↓ (usa)
IUserRepository (interface)
    ↓ (implementa)
JsonPlaceholderUserRepository
    ↓
API JSONPlaceholder
```

## 🎨 Componentes Compartidos

### Layout

`components/layout/AppLayout.tsx` - Layout principal con:

- Header con navegación
- Menú responsive
- Outlet para módulos

### UI Components

`components/ui/` - Componentes de shadcn/ui:

- Button
- Card
- Input
- etc.

## 🛣️ Routing Modular

```typescript
// router/index.tsx
{
  path: 'posts',      // Módulo Posts
  children: [
    { index: true, element: <PostList /> },
    { path: 'new', element: <PostForm /> },
    { path: ':id', element: <PostDetail /> },
    { path: ':id/edit', element: <PostForm /> },
  ]
},
{
  path: 'users',      // Módulo Users
  children: [
    { index: true, element: <UserList /> },
    { path: 'new', element: <UserForm /> },
    { path: ':id', element: <UserDetail /> },
    { path: ':id/edit', element: <UserForm /> },
  ]
}
```

## 📝 Agregar un Nuevo Módulo

### Paso 1: Crear estructura

```bash
mkdir -p src/modules/comments/{domain/entities,domain/repositories}
mkdir -p src/modules/comments/{application/use-cases}
mkdir -p src/modules/comments/{infrastructure/repositories}
mkdir -p src/modules/comments/{presentation/components,presentation/hooks}
mkdir -p src/modules/comments/di
```

### Paso 2: Crear entidades

```typescript
// modules/comments/domain/entities/Comment.ts
export interface Comment {
  id: number
  postId: number
  name: string
  email: string
  body: string
}
```

### Paso 3: Crear interface del repositorio

```typescript
// modules/comments/domain/repositories/ICommentRepository.ts
export interface ICommentRepository {
  findAll: () => Promise<Comment[]>
  findById: (id: number) => Promise<Comment | null>
  create: (comment: CreateCommentDto) => Promise<Comment>
  // ...
}
```

### Paso 4: Crear casos de uso

```typescript
// modules/comments/application/use-cases/GetCommentsUseCase.ts
export class GetCommentsUseCase {
  constructor(private readonly commentRepository: ICommentRepository) {}

  async execute(): Promise<Comment[]> {
    return await this.commentRepository.findAll()
  }
}
```

### Paso 5: Implementar repositorio

```typescript
// modules/comments/infrastructure/repositories/JsonPlaceholderCommentRepository.ts
export class JsonPlaceholderCommentRepository implements ICommentRepository {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com'
  // ... implementación
}
```

### Paso 6: Crear DI Container

```typescript
// modules/comments/di/CommentsContainer.ts
class CommentsContainer {
  private commentRepository: ICommentRepository | null = null
  // ... getters
}

export const commentsContainer = new CommentsContainer()
```

### Paso 7: Crear hooks

```typescript
// modules/comments/presentation/hooks/useCommentOperations.ts
export function useComments() {
  const getCommentsUseCase = commentsContainer.getGetCommentsUseCase()
  return useQuery({
    queryKey: ['comments'],
    queryFn: async () => await getCommentsUseCase.execute(),
  })
}
```

### Paso 8: Crear componentes

```typescript
// modules/comments/presentation/components/CommentList.tsx
export function CommentList() {
  const { data: comments } = useComments()
  // ... UI
}
```

### Paso 9: Agregar rutas

```typescript
// router/index.tsx
{
  path: 'comments',
  children: [
    { index: true, element: <CommentList /> },
    // ...
  ]
}
```

### Paso 10: Actualizar navegación

```typescript
// components/layout/AppLayout.tsx
<Link to="/comments">Comments</Link>
```

## 🎯 Buenas Prácticas

### ✅ DO (Hacer)

- Mantener cada módulo completamente independiente
- Usar DI Container para cada módulo
- Componentes compartidos en `/components`
- Lazy loading para todos los módulos
- Tests modulares separados

### ❌ DON'T (No Hacer)

- Importar entre módulos (`modules/posts` → `modules/users`)
- Mezclar lógica de negocio de diferentes módulos
- Componentes específicos de módulo fuera de su carpeta
- Repositorios compartidos entre módulos
- Casos de uso que usan múltiples módulos

## 🔍 Comparación con Estructura Monolítica

### ❌ Estructura Monolítica (Mala)

```
src/
├── entities/
│   ├── Post.ts
│   ├── User.ts
│   └── Comment.ts           # Todo mezclado
├── repositories/
│   ├── PostRepository.ts
│   ├── UserRepository.ts
│   └── CommentRepository.ts  # Difícil de encontrar
├── use-cases/
│   ├── CreatePost.ts
│   ├── CreateUser.ts        # Todo junto
│   └── CreateComment.ts
└── components/
    ├── PostList.tsx
    ├── UserList.tsx         # Difícil de mantener
    └── CommentList.tsx
```

### ✅ Estructura Modular (Buena)

```
src/modules/
├── posts/         # Todo de Posts aquí
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   └── di/
├── users/         # Todo de Users aquí
│   ├── domain/
│   ├── application/
│   ├── infrastructure/
│   ├── presentation/
│   └── di/
└── comments/      # Todo de Comments aquí
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/
    └── di/
```

## 📊 Métricas de Calidad

- **Acoplamiento**: Muy Bajo ✅
- **Cohesión**: Muy Alta ✅
- **Mantenibilidad**: Excelente ✅
- **Escalabilidad**: Excelente ✅
- **Testabilidad**: Excelente ✅
- **Reusabilidad**: Excelente ✅

## 🚀 Próximos Pasos

1. Agregar más módulos según necesidad
2. Implementar tests para cada módulo
3. Agregar documentación por módulo
4. Implementar feature flags por módulo
5. Microservicios → Cada módulo puede ser un servicio

## 📚 Recursos

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Modular Architecture](https://en.wikipedia.org/wiki/Modular_design)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/)

---

**Esta arquitectura permite que tu aplicación escale sin volverse un desastre** 🎉
