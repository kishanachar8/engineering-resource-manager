import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, PlusCircle } from "lucide-react";

// Define Zod schema for form validation
const assignmentSchema = z.object({
  engineerId: z.string().min(1, "Please select an engineer."),
  projectId: z.string().min(1, "Please select a project."),
  allocationPercentage: z.number().min(1, "Allocation must be at least 1%").max(100, "Allocation cannot exceed 100%"),
  startDate: z.string().min(1, "Start date is required.").refine(date => !isNaN(new Date(date).getTime()), "Invalid start date."),
  endDate: z.string().min(1, "End date is required.").refine(date => !isNaN(new Date(date).getTime()), "Invalid end date."),
  role: z.string().min(1, "Role is required."),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type FormData = z.infer<typeof assignmentSchema>;

type Engineer = {
  _id: string;
  name: string;
  email: string;
};

type Project = {
  _id: string;
  name: string;
};

export default function CreateAssignment() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      engineerId: "",
      projectId: "",
      allocationPercentage: 50, // Default allocation
      startDate: "",
      endDate: "",
      role: "",
    },
  });

  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [formLoading, setFormLoading] = useState(false); // For form submission
  const [error, setError] = useState<string | null>(null); // For general errors
  const [selectedEngineer, setSelectedEngineer] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const engRes = await API.get("/engineers");
        const projRes = await API.get("/projects");
        setEngineers(engRes.data);
        setProjects(projRes.data);
        // Set default select values if needed
        if (engRes.data.length > 0) {
          setSelectedEngineer("");
        }
        if (projRes.data.length > 0) {
          setSelectedProject("");
        }
      } catch (err) {
        console.error("Failed to fetch engineers or projects:", err);
        setError("Failed to load necessary data for assignment creation. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    setError(null); // Clear previous errors
    try {
      await API.post("/assignments", data);
      console.log("Assignment created successfully!");
      // TODO: Replace with a user-friendly toast notification or modal
      alert("Assignment created successfully!"); // Temporary alert
    } catch (err) {
      console.error("Failed to create assignment:", err);
      // TODO: Replace with a user-friendly toast notification or modal
      alert("Failed to create assignment. Please check your inputs."); // Temporary alert
      setError("Failed to create assignment. Please check your inputs and try again.");
    } finally {
      setFormLoading(false);
    }
  };

  // Display loading state for initial data fetch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading data...
        </div>
      </div>
    );
  }

  // Display error state
  if (error && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-xl font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle /> Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-10">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 text-center">
        Create Assignment
      </h2>
      <Card className="max-w-xl mx-auto shadow-lg dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            New Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Engineer Select */}
            <div>
              <Label htmlFor="engineerId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Engineer</Label>
              <Select
                onValueChange={(val) => {
                  setSelectedEngineer(val);
                  setValue("engineerId", val, { shouldValidate: true });
                }}
                value={selectedEngineer}
              >
                <SelectTrigger id="engineerId" className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <SelectValue placeholder="Select Engineer" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {engineers.length === 0 ? (
                    <SelectItem value="no-engineers" disabled>No engineers available</SelectItem>
                  ) : (
                    engineers.map((eng: Engineer) => (
                      <SelectItem key={eng._id} value={eng._id} className="dark:text-gray-200 hover:dark:bg-gray-700">
                        {eng.name} ({eng.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.engineerId && <p className="text-sm text-red-500 mt-1">{errors.engineerId.message}</p>}
            </div>

            {/* Project Select */}
            <div>
              <Label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Project</Label>
              <Select
                onValueChange={(val) => {
                  setSelectedProject(val);
                  setValue("projectId", val, { shouldValidate: true });
                }}
                value={selectedProject}
              >
                <SelectTrigger id="projectId" className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {projects.length === 0 ? (
                    <SelectItem value="no-projects" disabled>No projects available</SelectItem>
                  ) : (
                    projects.map((proj: Project) => (
                      <SelectItem key={proj._id} value={proj._id} className="dark:text-gray-200 hover:dark:bg-gray-700">
                        {proj.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.projectId && <p className="text-sm text-red-500 mt-1">{errors.projectId.message}</p>}
            </div>

            {/* Allocation Percentage */}
            <div>
              <Label htmlFor="allocationPercentage" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Allocation (%)</Label>
              <Input
                id="allocationPercentage"
                type="number"
                {...register("allocationPercentage", { valueAsNumber: true })}
                placeholder="e.g., 50"
                min="1"
                max="100"
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              {errors.allocationPercentage && <p className="text-sm text-red-500 mt-1">{errors.allocationPercentage.message}</p>}
            </div>

            {/* Start Date */}
            <div>
              <Label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Start Date</Label>
              <Input id="startDate" type="date" {...register("startDate")} className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
            </div>

            {/* End Date */}
            <div>
              <Label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">End Date</Label>
              <Input id="endDate" type="date" {...register("endDate")} className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
            </div>

            {/* Role in Project */}
            <div>
              <Label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Role in Project</Label>
              <Input id="role" type="text" {...register("role")} placeholder="e.g., Tech Lead, Backend Developer" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 mt-4"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              {formLoading ? "Creating..." : "Create Assignment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
