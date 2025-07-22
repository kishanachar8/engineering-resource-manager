import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import API from "../../lib/axios"
import { useAuthStore } from "../../store/authStore"

type LoginFormInputs = {
  email: string
  password: string
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginFormInputs>()
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormInputs) => {
    console.log("Form data submitted:", data);
    try {
      const res = await API.post('/auth/login', data)
          console.log("API Response:", res.data); // <-- Add this

      login(
        res.data.token,
        res.data.user.role,
        res.data.user._id,
        res.data.user.name,
        res.data.user.email
      )
      navigate(res.data.user.role === "manager" ? "/manager/dashboard" : "/engineer/dashboard")
    } catch (err) {
      console.error("Login failed:", err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Email 
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
