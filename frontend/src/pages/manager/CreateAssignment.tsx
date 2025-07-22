import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
// import { Select, SelectItem } from "../../components/ui/select"

type FormData = {
  engineerId: string
  projectId: string
  allocationPercentage: number
  startDate: string
  endDate: string
  role: string
}

type Engineer = {
  _id: string
  name: string
  email: string
}

type Project = {
  _id: string
  name: string
}


export default function CreateAssignment() {
   const { register, handleSubmit } = useForm<FormData>()
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const engRes = await API.get("/engineers")
      const projRes = await API.get("/projects")
      setEngineers(engRes.data)
      setProjects(projRes.data)
    }
    fetchData()
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      await API.post("/assignments", data)
      alert("Assignment created successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to create assignment")
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Create Assignment</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Engineer</Label>
          <select {...register("engineerId")} className="w-full p-2 border rounded">
              {engineers.map((eng: Engineer) => (
              <option key={eng._id} value={eng._id}>
                {eng.name} ({eng.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Project</Label>
          <select {...register("projectId")} className="w-full p-2 border rounded">
            {projects.map((proj: Project) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Allocation (%)</Label>
          <Input type="number" {...register("allocationPercentage")} placeholder="e.g. 50" />
        </div>

        <div>
          <Label>Start Date</Label>
          <Input type="date" {...register("startDate")} />
        </div>

        <div>
          <Label>End Date</Label>
          <Input type="date" {...register("endDate")} />
        </div>

        <div>
          <Label>Role in Project</Label>
          <Input type="text" {...register("role")} placeholder="e.g. Tech Lead" />
        </div>

        <Button type="submit" className="mt-2">Create Assignment</Button>
      </form>
    </div>
  )
}
