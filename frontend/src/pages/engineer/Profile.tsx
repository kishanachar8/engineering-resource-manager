import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import API from "../../lib/axios"
import { useAuthStore } from "../../store/authStore"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card"

type FormData = {
  skills: string
  seniority: string
}

type EngineerProfile = {
  name: string
  email: string
  role: "engineer" | "manager"
  skills: string[]
  seniority: string
}

export default function EngineerProfile() {
  const { user } = useAuthStore()
  const userId = user?._id
  const { register, handleSubmit, setValue } = useForm<FormData>()
  const [profile, setProfile] = useState<EngineerProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await API.get(`/engineers/${userId}`)
      setProfile(res.data)
      setValue("skills", res.data.skills.join(", "))
      setValue("seniority", res.data.seniority)
    }
    fetchProfile()
  }, [userId, setValue])

  const onSubmit = async (data: FormData) => {
    const updated = {
      skills: data.skills.split(",").map((s) => s.trim()),
      seniority: data.seniority,
    }

    await API.put(`/engineers/${userId}`, updated)
    alert("Profile updated successfully")
  }

  if (!profile) return <div className="text-center py-10">Loading profile...</div>

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl">Engineer Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p>
              <strong>Name:</strong> {profile.name}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Role:</strong> {profile.role}
            </p>
            <p>
              <strong>Seniority:</strong> {profile.seniority}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">Seniority Level</label>
              <Input {...register("seniority")} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Skills (comma-separated)</label>
              <Input {...register("skills")} />
            </div>

            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>

          <div className="mt-6">
            <h4 className="font-medium mb-2">Current Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs px-2 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
