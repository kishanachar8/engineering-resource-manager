// src/store/assignmentStore.ts
import { create } from 'zustand'

export interface Assignment {
  _id: string
  engineerId: string
  projectId: string
  allocationPercentage: number
  startDate: string
  endDate: string
  role: string
}

export interface Project {
  _id: string
  name: string
  description: string
  requiredSkills: string[]
  startDate: string
  endDate: string
  teamSize: number
  status: 'planning' | 'active' | 'completed'
}

interface AssignmentState {
  assignments: Assignment[]
  setAssignments: (a: Assignment[]) => void
  projects: Project[]
  setProjects: (p: Project[]) => void
}

export const useAssignmentStore = create<AssignmentState>((set) => ({
  assignments: [],
  setAssignments: (a) => set({ assignments: a }),
  projects: [],
  setProjects: (p) => set({ projects: p }),
}))
