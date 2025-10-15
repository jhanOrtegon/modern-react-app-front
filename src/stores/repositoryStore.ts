import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { PostRepositoryType } from '../modules/posts/di/PostsContainer'
import type { UserRepositoryType } from '../modules/users/di/UsersContainer'

/**
 * Estado del store de repositorios
 */
interface RepositoryState {
  // Tipos de repositorio seleccionados
  userRepositoryType: UserRepositoryType
  postRepositoryType: PostRepositoryType

  // Visibilidad del selector
  isSelectorVisible: boolean

  // Acciones para cambiar repositorios
  setUserRepositoryType: (type: UserRepositoryType) => void
  setPostRepositoryType: (type: PostRepositoryType) => void

  // Acciones para controlar visibilidad
  toggleSelectorVisibility: () => void
  setSelectorVisibility: (visible: boolean) => void
}

/**
 * Store global de configuración de repositorios con persistencia en localStorage
 *
 * Características:
 * - Persiste los tipos de repositorio seleccionados
 * - Persiste el estado de visibilidad del selector
 * - Se restaura automáticamente al recargar la página
 * - Usa localStorage como storage por defecto
 */
export const useRepositoryStore = create<RepositoryState>()(
  persist(
    set => ({
      // Estado inicial
      userRepositoryType: 'jsonplaceholder',
      postRepositoryType: 'jsonplaceholder',
      isSelectorVisible: true, // Visible por defecto como solicitado

      // Acciones
      setUserRepositoryType: type => set({ userRepositoryType: type }),

      setPostRepositoryType: type => set({ postRepositoryType: type }),

      toggleSelectorVisibility: () =>
        set(state => ({ isSelectorVisible: !state.isSelectorVisible })),

      setSelectorVisibility: visible => set({ isSelectorVisible: visible }),
    }),
    {
      name: 'repository-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage
      // Opcional: puedes especificar qué partes del estado persistir
      partialize: state => ({
        userRepositoryType: state.userRepositoryType,
        postRepositoryType: state.postRepositoryType,
        isSelectorVisible: state.isSelectorVisible,
      }),
    }
  )
)
