import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Account } from '../../domain/entities/Account'

interface AuthState {
  account: Account | null
  token: string | null
  isAuthenticated: boolean

  setAuth: (account: Account, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      account: null,
      token: null,
      isAuthenticated: false,

      setAuth: (account, token) =>
        set({
          account,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          account: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        account: state.account,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
