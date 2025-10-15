import { useQueryClient } from '@tanstack/react-query'
import { Database, HardDrive, Server } from 'lucide-react'
import type { ReactElement } from 'react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import type { PostRepositoryType } from '../../modules/posts/di/PostsContainer'
import { postsContainer } from '../../modules/posts/di/PostsContainer'
import type { UserRepositoryType } from '../../modules/users/di/UsersContainer'
import { usersContainer } from '../../modules/users/di/UsersContainer'
import { useRepositoryStore } from '../../stores/repositoryStore'
import { Button } from '../ui/button'

interface RepositoryOption {
  value: UserRepositoryType | PostRepositoryType
  label: string
  icon: ReactElement
  description: string
}

const repositoryOptions: RepositoryOption[] = [
  {
    value: 'jsonplaceholder',
    label: 'JSONPlaceholder API',
    icon: <Server className="size-4" />,
    description: 'External REST API',
  },
  {
    value: 'localStorage',
    label: 'Local Storage',
    icon: <HardDrive className="size-4" />,
    description: 'Browser persistence',
  },
  {
    value: 'inMemory',
    label: 'In Memory',
    icon: <Database className="size-4" />,
    description: 'Mock data (session)',
  },
]

export function RepositorySelector(): ReactElement {
  const queryClient = useQueryClient()

  // Usar Zustand store en lugar de useState local
  const userRepoType = useRepositoryStore(state => state.userRepositoryType)
  const postRepoType = useRepositoryStore(state => state.postRepositoryType)
  const setUserRepositoryType = useRepositoryStore(
    state => state.setUserRepositoryType
  )
  const setPostRepositoryType = useRepositoryStore(
    state => state.setPostRepositoryType
  )

  // Sincronizar los containers con el estado de Zustand al montar
  useEffect(() => {
    usersContainer.setRepositoryType(userRepoType)
    postsContainer.setRepositoryType(postRepoType)
  }, [userRepoType, postRepoType])

  const handleUserRepoChange = async (
    type: UserRepositoryType
  ): Promise<void> => {
    // 1. Actualizar el store de Zustand (esto persistirá automáticamente)
    setUserRepositoryType(type)

    // 2. Cambiar el tipo de repositorio en el container
    usersContainer.setRepositoryType(type)

    // 3. Cancelar todas las queries en progreso
    await queryClient.cancelQueries({ queryKey: ['users'] })
    await queryClient.cancelQueries({ queryKey: ['user'] })

    // 4. RESETEAR completamente las queries (esto las marca como "nunca fetched")
    await queryClient.resetQueries({ queryKey: ['users'] })
    await queryClient.resetQueries({ queryKey: ['user'] })

    const option = repositoryOptions.find(opt => opt.value === type)
    toast.success('User repository changed', {
      description: option ? `Now using ${option.label}` : 'Repository changed',
    })
  }

  const handlePostRepoChange = async (
    type: PostRepositoryType
  ): Promise<void> => {
    // 1. Actualizar el store de Zustand (esto persistirá automáticamente)
    setPostRepositoryType(type)

    // 2. Cambiar el tipo de repositorio en el container
    postsContainer.setRepositoryType(type)

    // 3. Cancelar todas las queries en progreso
    await queryClient.cancelQueries({ queryKey: ['posts'] })
    await queryClient.cancelQueries({ queryKey: ['post'] })

    // 4. RESETEAR completamente las queries (esto las marca como "nunca fetched")
    await queryClient.resetQueries({ queryKey: ['posts'] })
    await queryClient.resetQueries({ queryKey: ['post'] })

    const option = repositoryOptions.find(opt => opt.value === type)
    toast.success('Post repository changed', {
      description: option ? `Now using ${option.label}` : 'Repository changed',
    })
  }

  return (
    <div className="flex h-[650px] flex-col space-y-6 overflow-y-auto rounded-lg border bg-card p-6 shadow-sm">
      <div>
        <h3 className="mb-4 text-lg font-semibold">Repository Configuration</h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Switch between different data sources for testing and development
        </p>
      </div>

      {/* Users Repository Selector */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Users Repository</div>
        <div className="grid gap-2">
          {repositoryOptions.map(option => (
            <Button
              key={`user-${option.value}`}
              className="justify-start"
              disabled={userRepoType === option.value}
              size="sm"
              variant={userRepoType === option.value ? 'default' : 'outline'}
              onClick={() => {
                void handleUserRepoChange(option.value as UserRepositoryType)
              }}
            >
              <span className="mr-2">{option.icon}</span>
              <span className="flex-1 text-left">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Posts Repository Selector */}
      <div className="space-y-3">
        <div className="text-sm font-medium">Posts Repository</div>
        <div className="grid gap-2">
          {repositoryOptions.map(option => (
            <Button
              key={`post-${option.value}`}
              className="justify-start"
              disabled={postRepoType === option.value}
              size="sm"
              variant={postRepoType === option.value ? 'default' : 'outline'}
              onClick={() => {
                void handlePostRepoChange(option.value as PostRepositoryType)
              }}
            >
              <span className="mr-2">{option.icon}</span>
              <span className="flex-1 text-left">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
        <p className="text-xs text-blue-900 dark:text-blue-100">
          <strong>Note:</strong> Changing repositories will invalidate the cache
          and reload data from the new source. LocalStorage persists data across
          sessions, while In Memory resets on page reload.
        </p>
      </div>
    </div>
  )
}
