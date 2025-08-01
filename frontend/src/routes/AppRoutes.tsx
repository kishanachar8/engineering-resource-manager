import { Routes, Route, Navigate } from 'react-router-dom'

import Login from '../pages/auth/Login'

import ManagerDashboard from '../pages/manager/Dashboard'
import TeamOverview from '../pages/manager/TeamOverview'
import Projects from '../pages/manager/Projects'
import CreateAssignment from '../pages/manager/CreateAssignment'
import ViewAssignments from '../pages/manager/ViewAssignments'
import AssignmentTimeline from '../pages/manager/AssignmentTimeline'
import SkillGap from '../pages/manager/SkillGap'
import Analytics from '../pages/manager/Analytics'

import EngineerDashboard from '../pages/engineer/Dashboard'
import MyAssignments from '../pages/engineer/MyAssignments'
import Profile from '../pages/engineer/Profile'

import { useAuthStore } from '../store/authStore'
// import '@/App.css'
import Register from '../pages/auth/Register'

// 🔐 Role-based route wrapper
const RequireRole = ({
  role,
  children,
}: {
  role: 'manager' | 'engineer'
  children: React.ReactNode
}) => {
  const currentRole = useAuthStore(state => state.user?.role)
  return currentRole === role ? <>{children}</> : <Navigate to="/login" />
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/register" element={<Register />} />

      <Route path="/login" element={<Login />} />

      {/* Manager Routes */}
      <Route
        path="/manager/dashboard"
        element={
          <RequireRole role="manager">
            <ManagerDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/manager/team"
        element={
          <RequireRole role="manager">
            <TeamOverview />
          </RequireRole>
        }
      />
      <Route
        path="/manager/projects"
        element={
          <RequireRole role="manager">
            <Projects />
          </RequireRole>
        }
      />
      
      <Route
        path="/manager/create-assignment"
        element={
          <RequireRole role="manager">
            <CreateAssignment />
          </RequireRole>
        }
      />
      <Route
        path="/manager/view-assignments"
        element={
          <RequireRole role="manager">
            <ViewAssignments />
          </RequireRole>
        }
      />
      <Route
        path="/manager/timeline"
        element={
          <RequireRole role="manager">
            <AssignmentTimeline />
          </RequireRole>
        }
      />
      <Route
        path="/manager/skill-gap"
        element={
          <RequireRole role="manager">
            <SkillGap />
          </RequireRole>
        }
      />
      <Route
        path="/manager/analytics"
        element={
          <RequireRole role="manager">
            <Analytics />
          </RequireRole>
        }
      />

      {/* Engineer Routes */}
      <Route
        path="/engineer/dashboard"
        element={
          <RequireRole role="engineer">
            <EngineerDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/engineer/assignments"
        element={
          <RequireRole role="engineer">
            <MyAssignments />
          </RequireRole>
        }
      />
      <Route
        path="/engineer/profile"
        element={
          <RequireRole role="engineer">
            <Profile />
          </RequireRole>
        }
      />
      {/* <Route
        path="/engineer/my-assignments"
        element={
          <RequireRole role="engineer">
            <MyAssignments />
          </RequireRole>
        }
      /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}
