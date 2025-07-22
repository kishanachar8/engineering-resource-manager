import { useEffect, useState } from "react"
import API from "../../lib/axios"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts"

// Custom status-based colors
const STATUS_COLORS: Record<string, string> = {
  completed: "#00C49F",  // Green
  active: "#FF4C4C",     // Red
  "on-hold": "#FFBB28",  // Yellow
}

type Engineer = {
  _id: string
  name: string
  email: string
  role: "engineer"
  skills: string[]
  seniority: string
  maxCapacity: number
}

type Assignment = {
  _id: string
  engineerId: string
  allocationPercentage: number
  status: "active" | "completed"
}

type Project = {
  _id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "on-hold"
}

export default function Analytics() {
  const [engineers, setEngineers] = useState<(Engineer & { currentCapacity: number })[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchAllData = async () => {
      const [engRes, assignRes, projRes] = await Promise.all([
        API.get("/engineers"),
        API.get("/assignments"),
        API.get("/projects"),
      ])

      const engineers: Engineer[] = engRes.data
      const assignments: Assignment[] = assignRes.data
      const projects: Project[] = projRes.data

      const engineersWithCapacity = engineers.map((eng) => {
        const engAssignments = assignments.filter(
          (a) => a.engineerId === eng._id && a.status === "active"
        )
        const currentCapacity = engAssignments.reduce(
          (sum, a) => sum + a.allocationPercentage,
          0
        )
        return { ...eng, currentCapacity }
      })

      setEngineers(engineersWithCapacity)
      setProjects(projects)
    }

    fetchAllData()
  }, [])

  const teamUtilData = engineers.map((e) => ({
    name: e.name || "Unnamed",
    utilized: e.currentCapacity,
    available: e.maxCapacity - e.currentCapacity,
  }))

  const statusCount: Record<Project["status"], number> = {
    active: 0,
    completed: 0,
    "on-hold": 0,
  }

  projects.forEach((p) => {
    statusCount[p.status] = (statusCount[p.status] || 0) + 1
  })

  const projectStatusData = Object.entries(statusCount).map(([status, value]) => ({
    name: status,
    value,
  }))

  return (
    <div className="p-6 space-y-12">
      <h2 className="text-2xl font-bold mb-4">Analytics Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Team Utilization */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Team Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamUtilData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilized" fill="#3182ce" name="Utilized (%)" />
              <Bar dataKey="available" fill="#90cdf4" name="Available (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Project Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {projectStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={STATUS_COLORS[entry.name] || "#8884d8"}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
