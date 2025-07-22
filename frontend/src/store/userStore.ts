// src/store/userStore.ts
import { create } from 'zustand'

export interface User {
  _id: string
  name: string
  email: string
  skills: string[]
  seniority: string
  maxCapacity: number
  employmentType: 'Full-time' | 'Part-time'
}

interface UserState {
  users: User[]
  setUsers: (users: User[]) => void
  selectedUser?: User
  setSelectedUser: (user: User) => void
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  setUsers: (users) => set({ users }),
  selectedUser: undefined,
  setSelectedUser: (user) => set({ selectedUser: user }),
}))
