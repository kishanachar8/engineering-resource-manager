import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { formatDate } from "../../utils/date"

type Assignment = {
  _id: string
  engineer: {
    _id: string
    name: string
  }
  project: {
    _id: string
    name: string
  }
  role: string
  allocationPercentage: number
  startDate: string
  endDate: string
}

export default function ViewAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    API.get("/assignments")
      .then((res) => setAssignments(res.data))
      .catch(console.error)
  }, [])
  // console.log(assignments)

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold">All Assignments</h2>

      {assignments.map((a) => (
        <Card key={a._id}>
          <CardHeader>
            <CardTitle>
              {a.engineer?.name} → {a.project?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <p><strong>Engineer:</strong> {a.engineer?.name}</p>
            <p><strong>Project:</strong> {a.project?.name}</p>
            <p><strong>Role:</strong> {a.role}</p>
            <p><strong>Allocation:</strong> {a.allocationPercentage}%</p>
            <p><strong>Start:</strong> {formatDate(a.startDate)}</p>
            <p><strong>End:</strong> {formatDate(a.endDate)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
