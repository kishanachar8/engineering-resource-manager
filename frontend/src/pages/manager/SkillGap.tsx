import { useEffect, useState } from "react"
import API from "../../lib/axios"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"

type Engineer = {
  _id: string
  name: string
  email: string
  role: "engineer"
  skills: string[]
  seniority: string
  maxCapacity: number
  currentCapacity: number
}

type Project = {
  _id: string
  name: string
  description: string
  requiredSkills: string[]
  startDate: string
  endDate: string
  status: "active" | "completed" | "on-hold"
}

export default function SkillGap() {
  const [engineers, setEngineers] = useState<Engineer[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    API.get("/projects").then((res) => setProjects(res.data))
    API.get("/engineers").then((res) => setEngineers(res.data))
  }, [])

  const getMatchingSkills = (required: string[], engineerSkills: string[]) =>
    required.filter((skill) => engineerSkills.includes(skill))

  const getMissingSkills = (required: string[], allEngineerSkills: string[]) =>
    required.filter((skill) => !allEngineerSkills.includes(skill))

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Skill Gap Analysis</h2>

      {projects.map((project) => {
        const allEngineerSkills = engineers.flatMap((e) => e.skills)
        const matched = getMatchingSkills(project.requiredSkills, allEngineerSkills)
        const missing = getMissingSkills(project.requiredSkills, allEngineerSkills)

        return (
          <Card key={project._id} className="shadow border">
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{project.name}</h3>
                <p className="text-gray-500 text-sm">{project.description}</p>
              </div>

              <div>
                <p className="font-medium text-gray-700">Required Skills:</p>
                <div className="flex gap-2 flex-wrap mt-2">
                  {project.requiredSkills.map((skill: string) => (
                    <Badge
                      key={skill}
                      variant={matched.includes(skill) ? "default" : "destructive"}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-sm space-y-1">
                <p className="text-green-600 font-medium">
                  ✅ Matched:{" "}
                  {matched.length ? matched.join(", ") : "None"}
                </p>
                <p className="text-red-600 font-medium">
                  ❌ Missing:{" "}
                  {missing.length ? missing.join(", ") : "None"}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
