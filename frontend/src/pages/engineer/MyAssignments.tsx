import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { useAuthStore } from "../../store/authStore"
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { formatDate } from "../../utils/date"

interface Project {
  _id: string
  name: string
  description?: string
}

interface Assignment {
  _id: string
  project: Project
  role: string
  allocationPercentage: number
  startDate: string
  endDate: string
}

export default function MyAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const user = useAuthStore((s) => s.user)

  useEffect(() => {
    if (!user) return
    API.get(`/assignments/engineer/${user._id}`)
      .then((res) => setAssignments(res.data))
      .catch(console.error)
  }, [user])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">📋 My Project Assignments</h2>

      {assignments.length === 0 ? (
        <p className="text-center text-muted-foreground">You currently have no active assignments.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {assignments.map((a) => (
            <Card key={a._id} className="border border-border rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl text-primary">{a.project?.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{a.project?.description || "No description provided."}</p>
              </CardHeader>

              <CardContent className="mt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs px-3 py-1">{a.role}</Badge>
                  <Badge className="text-xs px-3 py-1">{a.allocationPercentage}% Allocation</Badge>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p><strong>Start:</strong> {formatDate(a.startDate)}</p>
                  <p><strong>End:</strong> {formatDate(a.endDate)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
