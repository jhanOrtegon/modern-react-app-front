import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Account } from '../modules/auth/domain/entities/Account'

/**
 * Estado del store de autenticación
 */
interface AuthState {
  // Estado
  account: Account | null
  token: string | null
  isAuthenticated: boolean

  // Acciones
  setAuth: (account: Account, token: string) => void
  logout: () => void
}

/**
 * Store global de autenticación con persistencia en localStorage
 *
 * Características:
 * - Persiste el usuario y token en localStorage
 * - Se restaura automáticamente al recargar la página
 * - Maneja login, logout y estado de autenticación
 */
export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      // Estado inicial
      account: null,
      token: null,
      isAuthenticated: false,

      // Acciones
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
      name: 'auth-storage', // Nombre de la clave en localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        account: state.account,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
