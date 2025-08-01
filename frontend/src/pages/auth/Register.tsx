import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, Link } from "react-router-dom";
import API from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X, Loader2, AlertCircle } from "lucide-react"; // Added Loader2 and AlertCircle for feedback

// Zod schema for form validation
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.string().min(1, "Role is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required").or(z.literal("")), // Allow empty string initially for select
  seniority: z.string().min(1, "Seniority level is required"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1").max(100, "Capacity cannot exceed 100"),
  department: z.string().min(1, "Department is required"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [meta, setMeta] = useState<{
    roles: string[];
    skills: string[];
    seniorityLevels: string[];
    departments: string[];
  } | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true); // For initial metadata fetch
  const [submitting, setSubmitting] = useState(false); // For form submission state
  const [formError, setFormError] = useState<string | null>(null); // For form-level errors

  const {
    register,
    handleSubmit,
    setValue,
    watch, // <-- Import watch here
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      seniority: "",
      department: "",
      skills: [],
      maxCapacity: 50,
    },
  });

  // Watch selected values for controlled components
  const watchedRole = watch("role");
  const watchedSeniority = watch("seniority");
  const watchedDepartment = watch("department");

  useEffect(() => {
    API.get("/meta")
      .then((res) => {
        setMeta(res.data);
        setLoadingMeta(false);
      })
      .catch((err) => {
        console.error("Failed to load meta:", err);
        setFormError("Failed to load registration options. Please try again.");
        setLoadingMeta(false);
      });
  }, []);

  const handleAddSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const updatedSkills = [...selectedSkills, skill];
      setSelectedSkills(updatedSkills);
      setValue("skills", updatedSkills, { shouldValidate: true });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updated = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updated);
    setValue("skills", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: RegisterFormInputs) => {
    setSubmitting(true);
    setFormError(null); // Clear previous errors
    try {
      const payload = {
        ...data,
        skills: selectedSkills, // Ensure skills from state are sent
      };
      const res = await API.post("/auth/register", payload);
      login(
        res.data.token,
        res.data.user.role,
        res.data.user._id,
        res.data.user.name,
        res.data.user.email
      );
      navigate(
        res.data.user.role === "manager"
          ? "/manager/dashboard"
          : "/engineer/dashboard"
      );
    } catch (err: unknown) {
      console.error("Registration failed:", err);
      // More specific error handling
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: unknown }).response === "object" &&
        (err as { response?: { data?: unknown } }).response !== null &&
        "data" in (err as { response?: { data?: unknown } }).response! &&
        typeof ((err as { response?: { data?: unknown } }).response as { data?: unknown }).data === "object" &&
        ((err as { response?: { data?: { message?: unknown } } }).response as { data?: { message?: unknown } }).data !== null &&
        "message" in ((err as { response?: { data?: { message?: unknown } } }).response as { data?: { message?: unknown } }).data!
      ) {
        setFormError(
          String(
            (
              (err as { response?: { data?: { message?: unknown } } }).response as {
                data?: { message?: unknown };
              }
            ).data!.message
          )
        );
      } else {
        setFormError("Registration failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Display loading state while metadata is being fetched
  if (loadingMeta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading registration options...
        </div>
      </div>
    );
  }

  // Display error if metadata failed to load
  if (formError && !meta) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-950 dark:to-gray-800 p-6">
        <div className="text-xl font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle /> Error: {formError}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-gray-50 mb-8">
          Join Us! 🚀
        </h2>

        {formError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Name
            </label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Your Full Name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <Input
              id="email"
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <Input
              id="password"
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {/* Role Select */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Role
            </label>
            <Select onValueChange={(val) => setValue("role", val, { shouldValidate: true })} value={watchedRole}>
              <SelectTrigger id="role" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {meta?.roles.map((r) => (
                  <SelectItem key={r} value={r} className="dark:text-gray-200 hover:dark:bg-gray-700">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
          </div>

          {/* Skills Select and Badges */}
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Skills
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedSkills.map((skill) => (
                <Badge key={skill} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-700 dark:hover:bg-blue-600 rounded-full px-3 py-1 text-sm font-medium transition duration-200">
                  {skill}
                  <X
                    size={14}
                    className="cursor-pointer ml-1 text-white hover:text-gray-100 transition-colors duration-200"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
            <Select onValueChange={handleAddSkill} value=""> {/* Set value to empty string to allow selecting same value again */}
              <SelectTrigger id="skills" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200">
                <SelectValue placeholder="Add Skill" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {meta?.skills.map((s) => (
                  <SelectItem key={s} value={s} className="dark:text-gray-200 hover:dark:bg-gray-700">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>}
          </div>

          {/* Seniority Select */}
          <div>
            <label htmlFor="seniority" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Seniority
            </label>
            <Select onValueChange={(val) => setValue("seniority", val, { shouldValidate: true })} value={watchedSeniority}>
              <SelectTrigger id="seniority" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {meta?.seniorityLevels.map((s) => (
                  <SelectItem key={s} value={s} className="dark:text-gray-200 hover:dark:bg-gray-700">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.seniority && <p className="text-sm text-red-500 mt-1">{errors.seniority.message}</p>}
          </div>

          {/* Max Capacity Input */}
          <div>
            <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Max Capacity (1-100)
            </label>
            <Input
              id="maxCapacity"
              type="number"
              placeholder="50"
              {...register("maxCapacity", { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200"
            />
            {errors.maxCapacity && <p className="text-sm text-red-500 mt-1">{errors.maxCapacity.message}</p>}
          </div>

          {/* Department Select */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
              Department
            </label>
            <Select onValueChange={(val) => setValue("department", val, { shouldValidate: true })} value={watchedDepartment}>
              <SelectTrigger id="department" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 transition duration-200">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                {meta?.departments.map((d) => (
                  <SelectItem key={d} value={d} className="dark:text-gray-200 hover:dark:bg-gray-700">
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>}
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105"
            disabled={submitting} // Disable button during submission
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition duration-200">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
