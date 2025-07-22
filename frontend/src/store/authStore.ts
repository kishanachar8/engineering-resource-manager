import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type User = {
  _id: string
  name: string
  email: string
  role: 'manager' | 'engineer'
}

type AuthState = {
  token: string | null
  user: User | null
  login: (token: string, role: string, userId: string, name: string, email: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: (token, role, userId, name, email) =>
        set({
          token,
          user: {
            _id: userId,
            name,
            email,
            role: role as 'manager' | 'engineer',
          },
        }),

      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // key in localStorage
    }
  )
)
