import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { PostRepositoryType } from '../modules/posts/di/PostsContainer'
import type { UserRepositoryType } from '../modules/users/di/UsersContainer'

interface RepositoryState {
  userRepositoryType: UserRepositoryType
  postRepositoryType: PostRepositoryType

  isSelectorVisible: boolean

  setUserRepositoryType: (type: UserRepositoryType) => void
  setPostRepositoryType: (type: PostRepositoryType) => void

  toggleSelectorVisibility: () => void
  setSelectorVisibility: (visible: boolean) => void
}

export const useRepositoryStore = create<RepositoryState>()(
  persist(
    set => ({
      userRepositoryType: 'jsonplaceholder',
      postRepositoryType: 'jsonplaceholder',
      isSelectorVisible: true,

      setUserRepositoryType: type => set({ userRepositoryType: type }),

      setPostRepositoryType: type => set({ postRepositoryType: type }),

      toggleSelectorVisibility: () =>
        set(state => ({ isSelectorVisible: !state.isSelectorVisible })),

      setSelectorVisibility: visible => set({ isSelectorVisible: visible }),
    }),
    {
      name: 'repository-storage',
      storage: createJSONStorage(() => localStorage),

      partialize: state => ({
        userRepositoryType: state.userRepositoryType,
        postRepositoryType: state.postRepositoryType,
        isSelectorVisible: state.isSelectorVisible,
      }),
    }
  )
)
