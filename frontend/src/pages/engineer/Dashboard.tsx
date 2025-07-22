import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { useAuthStore } from "../../store/authStore"
import { Card, CardContent } from "../../components/ui/card"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react";


interface Project {
  _id: string
  name: string
  description: string
}

interface Assignment {
  _id: string
  projectId: Project
  startDate: string
  endDate: string
  allocationPercentage: number
  role: string
}

export default function EngineerDashboard() {
  const userId = useAuthStore((state) => state.user?._id)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const fetchAssignments = async () => {
      try {
        const res = await API.get(`/assignments/engineer/${userId}`)
        setAssignments(res.data)
      } catch (err) {
        console.error("Failed to fetch assignments", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [userId])

  if (loading) return <p className="text-center mt-10">Loading assignments...</p>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Engineer DashBoard</h2>

      {assignments.length === 0 ? (
        <p className="text-center text-muted-foreground">No assignments found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">

                <Link to={`/engineer/assignments`} className="text-blue-600 hover:underline">
                  <span className="text-lg font-medium group-hover:text-primary">My Assignments</span>
                 <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary" />

                </Link>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  )
}
