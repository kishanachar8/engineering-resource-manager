import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { formatDate } from "../../utils/date"
import { differenceInDays, parseISO } from "date-fns"

interface RawAssignment {
  _id: string
  role: string
  allocationPercentage: number
  startDate: string
  endDate: string
  engineerId: string
  projectId: string
}

interface Assignment {
  _id: string
  role: string
  allocationPercentage: number
  startDate: string
  endDate: string
  engineer: { _id: string; name: string }
  project: { name: string }
}

// Generate consistent color per project
const colorMap = new Map<string, string>()
const colorPalette = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"
]
let colorIndex = 0
function getColor(projectName: string) {
  if (!colorMap.has(projectName)) {
    colorMap.set(projectName, colorPalette[colorIndex % colorPalette.length])
    colorIndex++
  }
  return colorMap.get(projectName)!
}

export default function AssignmentTimeline() {
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    API.get("/assignments")
      .then(async (res) => {
        const rawAssignments: RawAssignment[] = res.data

        const [engineersRes, projectsRes] = await Promise.all([
          API.get("/engineers"),
          API.get("/projects"),
        ])

        const engineerMap: Record<string, { _id: string; name: string }> =
          Object.fromEntries(engineersRes.data.map((e: { _id: string; name: string }) => [e._id, e]))

        const projectMap: Record<string, { name: string }> =
          Object.fromEntries(projectsRes.data.map((p: { _id: string; name: string }) => [p._id, p]))

        const assignments: Assignment[] = rawAssignments.map((a: RawAssignment): Assignment => ({
          ...a,
          engineer: engineerMap[a.engineerId],
          project: projectMap[a.projectId],
        }))

        setAssignments(assignments)
      })
      .catch(console.error)
  }, [])

  const assignmentsByEngineer = assignments.reduce((acc: Record<string, Assignment[]>, a) => {
    if (!a.engineer || !a.engineer._id) return acc
    if (!acc[a.engineer._id]) acc[a.engineer._id] = []
    acc[a.engineer._id].push(a)
    return acc
  }, {})

  const startDate = parseISO("2025-07-01")
  const endDate = parseISO("2025-10-31")
  const totalDays = differenceInDays(endDate, startDate)

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Assignment Timeline</h2>
      <div className="overflow-x-auto rounded-lg border bg-white shadow-md p-4">
        {Object.entries(assignmentsByEngineer).map(([engineerId, list], i) => (
          <div key={engineerId} className={`mb-6 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} p-4 rounded`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              👷 {list[0].engineer.name}
            </h3>

            <div className="relative h-10 border border-gray-300 bg-gray-100 rounded overflow-hidden">
              {list.map((a) => {
                const start = parseISO(a.startDate)
                const end = parseISO(a.endDate)
                const offsetDays = Math.max(differenceInDays(start, startDate), 0)
                const durationDays = Math.max(differenceInDays(end, start), 1)

                const left = (offsetDays / totalDays) * 100
                const width = (durationDays / totalDays) * 100
                const bgColor = getColor(a.project.name)

                return (
                  <div
                    key={a._id}
                    className="absolute top-[15%] h-[70%] rounded-md text-white text-xs px-2 py-0.5 flex items-center justify-center shadow-md truncate"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: bgColor,
                    }}
                    title={`${a.project.name} - ${a.role} | ${formatDate(a.startDate)} → ${formatDate(a.endDate)} | ${a.allocationPercentage}%`}
                  >
                    {a.project.name.length > 18
                      ? `${a.project.name.slice(0, 15)}... (${a.allocationPercentage}%)`
                      : `${a.project.name} (${a.allocationPercentage}%)`}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
