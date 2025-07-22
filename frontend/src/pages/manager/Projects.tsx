import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { useAssignmentStore } from "../../store/assignmentStore"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export interface Project {
  _id: string
  name: string
  description: string
  startDate: string
  endDate: string
  requiredSkills: string[]
  teamSize: number
  status: 'active' | 'completed' | 'planning'
}

// Schema matching raw form values
const rawProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  requiredSkills: z.string(), // comma-separated input
  teamSize: z.string().min(1), // form input is a string
  status: z.enum(["planning", "active", "completed"]),
})

type RawProjectForm = z.infer<typeof rawProjectSchema>

export default function Projects() {
  const { projects, setProjects } = useAssignmentStore()
  const [editing, setEditing] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm<RawProjectForm>({
    resolver: zodResolver(rawProjectSchema),
  })

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await API.get("/projects")
      setProjects(res.data)
    }
    fetchProjects()
  }, [])

  const onSubmit = async (data: RawProjectForm) => {
    const transformed = {
      ...data,
      requiredSkills: data.requiredSkills.split(',').map(s => s.trim()),
      teamSize: parseInt(data.teamSize, 10),
    }

    try {
      if (editing) {
        await API.put(`/projects/${editing}`, transformed)
      } else {
        await API.post("/projects", transformed)
      }

      const res = await API.get("/projects")
      setProjects(res.data)
      reset()
      setEditing(null)
    } catch (err) {
      console.error("Failed to save project", err)
    }
  }

  const handleEdit = (projectId: string) => {
    const project = projects.find(p => p._id === projectId)
    if (!project) return
    reset({
      name: project.name,
      description: project.description,
      startDate: project.startDate.slice(0, 10),
      endDate: project.endDate.slice(0, 10),
      requiredSkills: project.requiredSkills.join(', '),
      teamSize: project.teamSize.toString(),
      status: project.status,
    })
    setEditing(projectId)
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Project Management</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 bg-card p-6 rounded-xl shadow-md">
        <input {...register("name")} placeholder="Project Name" className="input" />
        <input type="date" {...register("startDate")} className="input" />
        <input type="date" {...register("endDate")} className="input" />
        <input {...register("teamSize")} type="number" placeholder="Team Size" className="input" />
        <input {...register("requiredSkills")} placeholder="Skills (comma-separated)" className="input col-span-full" />
        <select {...register("status")} className="input col-span-full">
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <textarea {...register("description")} placeholder="Project Description" className="input col-span-full h-24 resize-none" />
        <button type="submit" className="btn col-span-full">
          {editing ? "Update Project" : "Create Project"}
        </button>
      </form>

      <div className="grid gap-6">
        {projects.map(project => (
          <div key={project._id} className="p-6 bg-white dark:bg-muted rounded-lg shadow-md transition hover:shadow-lg">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="text-muted-foreground text-sm mb-1">{project.description}</p>
                <p className="text-sm mb-1">
                  📅 {project.startDate.slice(0, 10)} → {project.endDate.slice(0, 10)} | 👥 {project.teamSize}
                </p>
                <p className="text-sm mb-2">📌 Status: <span className="font-medium">{project.status}</span></p>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map(skill => (
                    <span key={skill} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <button
                className="text-blue-600 hover:underline text-sm font-medium"
                onClick={() => handleEdit(project._id)}
              >
                ✏️ Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
