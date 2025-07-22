import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
import API from "@/lib/axios"
import { useAuthStore } from "@/store/authStore"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  seniority: z.string().min(1),
  maxCapacity: z.number().min(1).max(100),
  department: z.string().min(1),
})

type RegisterFormInputs = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [meta, setMeta] = useState<{
    roles: string[]
    skills: string[]
    seniorityLevels: string[]
    departments: string[]
  } | null>(null)

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    API.get("/meta")
      .then((res) => setMeta(res.data))
      .catch((err) => console.error("Failed to load meta:", err))
  }, [])

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill]
      setSelectedSkills(updatedSkills)
      setValue("skills", updatedSkills)
    }
  }

  const handleRemoveSkill = (skill: string) => {
    const updated = selectedSkills.filter((s) => s !== skill)
    setSelectedSkills(updated)
    setValue("skills", updated)
  }

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const res = await API.post("/auth/register", data)
      login(
        res.data.token,
        res.data.user.role,
        res.data.user._id,
        res.data.user.name,
        res.data.user.email
      )
      navigate(
        res.data.user.role === "manager"
          ? "/manager/dashboard"
          : "/engineer/dashboard"
      )
    } catch (err) {
      console.error("Registration failed:", err)
    }
  }

  if (!meta) return <div className="text-center mt-20">Loading...</div>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <Input {...register("name")} placeholder="Kishan" />
            <p className="text-xs text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <Input {...register("email")} type="email" placeholder="you@example.com" />
            <p className="text-xs text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <Input {...register("password")} type="password" placeholder="••••••••" />
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Role
            </label>
            <Select onValueChange={(val) => setValue("role", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {meta.roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">{errors.role?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedSkills.map((skill) => (
                <Badge key={skill} className="flex items-center gap-1">
                  {skill}
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleAddSkill}>
              <SelectTrigger>
                <SelectValue placeholder="Add Skill" />
              </SelectTrigger>
              <SelectContent>
                {meta.skills.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">{errors.skills?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Seniority
            </label>
            <Select onValueChange={(val) => setValue("seniority", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {meta.seniorityLevels.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">{errors.seniority?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Max Capacity
            </label>
            <Input
              type="number"
              placeholder="100"
              {...register("maxCapacity", { valueAsNumber: true })}
            />
            <p className="text-xs text-red-500">{errors.maxCapacity?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Department
            </label>
            <Select onValueChange={(val) => setValue("department", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                {meta.departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-red-500">{errors.department?.message}</p>
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
