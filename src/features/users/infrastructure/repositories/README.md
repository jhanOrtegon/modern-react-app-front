# User Repositories

Este módulo incluye tres implementaciones diferentes del repositorio de usuarios, cada una con características distintas.

## Repositorios Disponibles

### 1. JsonPlaceholderUserRepository (Por defecto)

**Ubicación:** `JsonPlaceholderUserRepository.ts`

**Descripción:** Repositorio que consume la API pública de JSONPlaceholder para operaciones CRUD de usuarios.

**Características:**

- ✅ Datos reales de API externa
- ✅ Simula comportamiento de API REST real
- ❌ No persiste cambios (la API es de solo lectura en realidad)
- ✅ Requiere conexión a internet
- ✅ Ideal para desarrollo y testing con datos externos

**Uso:**

```typescript
// Este es el repositorio por defecto, no necesita configuración
```

---

### 2. LocalStorageUserRepository

**Ubicación:** `LocalStorageUserRepository.ts`

**Descripción:** Repositorio que almacena usuarios en el localStorage del navegador.

**Características:**

- ✅ Persistencia local en el navegador
- ✅ Los datos sobreviven a recargas de página
- ✅ No requiere conexión a internet
- ✅ Operaciones CRUD completamente funcionales
- ❌ Datos se pierden al limpiar el navegador
- ✅ Ideal para desarrollo sin conexión o demos

**Uso:**

```typescript
import { usersContainer } from '../di/UsersContainer'

// Cambiar al repositorio de localStorage
usersContainer.setRepositoryType('localStorage')
```

**Nota:** Los datos se guardan bajo la clave `users_storage` en localStorage.

---

### 3. InMemoryUserRepository

**Ubicación:** `InMemoryUserRepository.ts`

**Descripción:** Repositorio mock que mantiene datos en memoria durante la sesión.

**Características:**

- ✅ 5 usuarios de prueba pre-cargados
- ✅ Operaciones CRUD completamente funcionales
- ✅ Simula latencia de red (200-400ms)
- ❌ Datos se reinician al recargar la página
- ✅ No requiere conexión a internet
- ✅ Ideal para desarrollo rápido y testing

**Usuarios de Prueba:**

1. Alice Johnson - Tech Innovations Inc
2. Bob Smith - Digital Dreams LLC
3. Carol Williams - Cloud Systems Corp
4. David Brown - Data Dynamics
5. Emma Davis - Quantum Solutions

**Uso:**

```typescript
import { usersContainer } from '../di/UsersContainer'

// Cambiar al repositorio en memoria
usersContainer.setRepositoryType('inMemory')
```

---

## Cambiar entre Repositorios

### Opción 1: En el código de inicialización

Puedes cambiar el repositorio en `App.tsx` o donde inicialices tu aplicación:

```typescript
import { usersContainer } from './modules/users/di/UsersContainer'

// Al inicio de tu aplicación
usersContainer.setRepositoryType('inMemory') // o 'localStorage' o 'jsonplaceholder'
```

### Opción 2: Dinámicamente en la UI

Puedes crear un selector en tu interfaz para cambiar entre repositorios:

```typescript
import { usersContainer, type UserRepositoryType } from './modules/users/di/UsersContainer'
import { useQueryClient } from '@tanstack/react-query'

function RepositorySelector(): ReactElement {
  const queryClient = useQueryClient()
  const [currentRepo, setCurrentRepo] = useState<UserRepositoryType>(
    usersContainer.getRepositoryType()
  )

  const handleChange = (type: UserRepositoryType): void => {
    usersContainer.setRepositoryType(type)
    setCurrentRepo(type)
    // Invalida el cache para refrescar los datos
    void queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  return (
    <select
      value={currentRepo}
      onChange={(e) => handleChange(e.target.value as UserRepositoryType)}
    >
      <option value="jsonplaceholder">JSONPlaceholder API</option>
      <option value="localStorage">Local Storage</option>
      <option value="inMemory">In Memory (Mock)</option>
    </select>
  )
}
```

---

## Comparación Rápida

| Característica     | JSONPlaceholder  | LocalStorage       | InMemory           |
| ------------------ | ---------------- | ------------------ | ------------------ |
| Persistencia       | ❌ (API externa) | ✅ (localStorage)  | ❌ (sesión)        |
| Internet requerido | ✅               | ❌                 | ❌                 |
| Datos de prueba    | ✅ (10 usuarios) | ⚠️ (vacío inicial) | ✅ (5 usuarios)    |
| CRUD funcional     | ⚠️ (simulado)    | ✅                 | ✅                 |
| Velocidad          | 🐢 (red)         | ⚡ (instant)       | ⚡ (simulado)      |
| Uso recomendado    | Producción/Demo  | Desarrollo offline | Testing/Desarrollo |

---

## Consideraciones

### LocalStorage

- **Límite de almacenamiento:** ~5-10MB dependiendo del navegador
- **Serialización:** Los datos se guardan como JSON strings
- **Limpieza:** Los usuarios pueden limpiar localStorage manualmente

### InMemory

- **Datos temporales:** Se pierden al recargar
- **Latencia simulada:** Útil para testing de estados de carga
- **Datos predefinidos:** Facilita el desarrollo sin configuración

### JSONPlaceholder

- **Dependencia externa:** Requiere que jsonplaceholder.typicode.com esté disponible
- **Limitaciones:** Las mutaciones no persisten realmente
- **Rate limiting:** Posibles límites de tasa en la API pública

---

## Crear tu Propio Repositorio

Si necesitas un repositorio personalizado, simplemente implementa la interfaz `IUserRepository`:

```typescript
import type { IUserRepository } from '../../domain/repositories/IUserRepository'
import type {
  CreateUserDto,
  UpdateUserDto,
  User,
} from '../../domain/entities/User'

export class MyCustomUserRepository implements IUserRepository {
  findAll = async (): Promise<User[]> => {
    // Tu implementación
  }

  findById = async (id: number): Promise<User | null> => {
    // Tu implementación
  }

  create = async (user: CreateUserDto): Promise<User> => {
    // Tu implementación
  }

  update = async (user: UpdateUserDto): Promise<User> => {
    // Tu implementación
  }

  delete = async (id: number): Promise<void> => {
    // Tu implementación
  }
}
```

Luego agrégalo al contenedor DI en `UsersContainer.ts`.
