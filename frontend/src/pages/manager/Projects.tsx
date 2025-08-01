import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { useAssignmentStore } from "../../store/assignmentStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input"; // Replaced with Shadcn Input
import { Button } from "@/components/ui/button"; // Replaced with Shadcn Button
import { Textarea } from "@/components/ui/textarea"; // New: Shadcn Textarea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Replaced with Shadcn Select
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // For project cards
import { Badge } from "@/components/ui/badge"; // For status and skills badges
import { CalendarDays, Users, Tag, Edit, PlusCircle, Loader2, AlertCircle } from "lucide-react"; // Icons for visual flair

export interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  requiredSkills: string[];
  teamSize: number;
  status: 'active' | 'completed' | 'planning';
}

// Schema matching raw form values with improved validation messages
const rawProjectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  description: z.string().min(1, "Description is required."),
  startDate: z.string().min(1, "Start date is required.").refine(date => !isNaN(new Date(date).getTime()), "Invalid start date."),
  endDate: z.string().min(1, "End date is required.").refine(date => !isNaN(new Date(date).getTime()), "Invalid end date."),
  requiredSkills: z.string().min(1, "At least one skill is required (comma-separated)."), // comma-separated input
  teamSize: z.string().min(1, "Team size is required.").refine(val => !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0, "Team size must be a positive number."), // form input is a string
  status: z.enum(["planning", "active", "completed"], { message: "Please select a valid status." }),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be before start date.",
  path: ["endDate"], // Path to the field that caused the error
});

type RawProjectForm = z.infer<typeof rawProjectSchema>;

export default function Projects() {
  const { projects, setProjects } = useAssignmentStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false); // For form submission loading
  const [error, setError] = useState<string | null>(null); // For global error messages

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<RawProjectForm>({
    resolver: zodResolver(rawProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      requiredSkills: "",
      teamSize: "",
      status: "planning", // Set a default status
    },
  });

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await API.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [setProjects]);

  // Handle form submission (create or update project)
  const onSubmit = async (data: RawProjectForm) => {
    setFormLoading(true);
    setError(null); // Clear previous errors

    const transformed = {
      ...data,
      requiredSkills: data.requiredSkills.split(',').map(s => s.trim()).filter(s => s !== ''), // Ensure no empty strings
      teamSize: parseInt(data.teamSize, 10),
    };

    try {
      if (editing) {
        await API.put(`/projects/${editing}`, transformed);
      } else {
        await API.post("/projects", transformed);
      }

      // Re-fetch projects to update the list
      const res = await API.get("/projects");
      setProjects(res.data);
      reset(); // Clear form fields
      setEditing(null); // Exit editing mode
    } catch (err) {
      console.error("Failed to save project", err);
      setError("Failed to save project. Please check your inputs.");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle editing a project: populate form with project data
  const handleEdit = (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    if (!project) return;

    // Use setValue for react-hook-form to populate fields
    setValue("name", project.name);
    setValue("description", project.description);
    setValue("startDate", project.startDate.slice(0, 10)); // Format date for input type="date"
    setValue("endDate", project.endDate.slice(0, 10));     // Format date for input type="date"
    setValue("requiredSkills", project.requiredSkills.join(', '));
    setValue("teamSize", project.teamSize.toString());
    setValue("status", project.status);
    setEditing(projectId);
  };

  // Handle cancelling edit mode
  const handleCancelEdit = () => {
    reset();
    setEditing(null);
  };

  // Display loading state for initial data fetch
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading projects...
        </div>
      </div>
    );
  }

  // Display global error message
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
        Project Management 🛠️
      </h2>

      {/* Project Form */}
      <Card className="max-w-3xl mx-auto mb-10 p-6 rounded-xl shadow-lg bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {editing ? "Edit Project" : "Create New Project"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Project Name</label>
              <Input id="name" {...register("name")} placeholder="e.g., E-commerce Platform" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Start Date</label>
              <Input id="startDate" type="date" {...register("startDate")} className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate.message}</p>}
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">End Date</label>
              <Input id="endDate" type="date" {...register("endDate")} className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate.message}</p>}
            </div>

            {/* Team Size */}
            <div>
              <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Team Size</label>
              <Input id="teamSize" {...register("teamSize")} type="number" placeholder="e.g., 5" min="1" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.teamSize && <p className="text-sm text-red-500 mt-1">{errors.teamSize.message}</p>}
            </div>

            {/* Required Skills */}
            <div className="md:col-span-2">
              <label htmlFor="requiredSkills" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Required Skills (comma-separated)</label>
              <Input id="requiredSkills" {...register("requiredSkills")} placeholder="e.g., React, Node.js, AWS" className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
              {errors.requiredSkills && <p className="text-sm text-red-500 mt-1">{errors.requiredSkills.message}</p>}
            </div>

            {/* Status Select */}
            <div className="md:col-span-2">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Status</label>
              <Select
                onValueChange={(val: "planning" | "active" | "completed") => setValue("status", val, { shouldValidate: true })}
                value={watch("status") || "planning"}
              >
                <SelectTrigger id="status" className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  <SelectItem value="planning" className="dark:text-gray-200 hover:dark:bg-gray-700">Planning</SelectItem>
                  <SelectItem value="active" className="dark:text-gray-200 hover:dark:bg-gray-700">Active</SelectItem>
                  <SelectItem value="completed" className="dark:text-gray-200 hover:dark:bg-gray-700">Completed</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Description</label>
              <Textarea id="description" {...register("description")} placeholder="Detailed description of the project..." rows={4} className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 resize-y" />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
            </div>

            {/* Form Action Buttons */}
            <div className="md:col-span-2 flex gap-4 mt-2">
              <Button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105" disabled={formLoading}>
                {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editing ? <Edit className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                {formLoading ? "Saving..." : editing ? "Update Project" : "Create Project"}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} className="flex-1 py-2.5 border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition duration-200">
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {projects.length === 0 && !loading && (
          <p className="md:col-span-full text-center text-gray-600 dark:text-gray-400 text-lg">No projects found. Start by creating one above!</p>
        )}
        {projects.map(project => (
          <Card key={project._id} className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <CardHeader className="p-0 mb-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">{project.name}</CardTitle>
                <Badge className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  project.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                  project.status === 'completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100' :
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">{project.description}</p>
            </CardHeader>

            <CardContent className="p-0 flex-grow">
              <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1 mb-4">
                <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" /> <strong>Dates:</strong> {project.startDate.slice(0, 10)} &ndash; {project.endDate.slice(0, 10)}</p>
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-500 dark:text-gray-400" /> <strong>Team Size:</strong> {project.teamSize}</p>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {project.requiredSkills.map(skill => (
                    <Badge key={skill} className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 text-xs font-medium px-2 py-1 rounded-md">
                      <Tag className="w-3 h-3 mr-1" /> {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  className="w-full flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 border-blue-600 dark:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors duration-200"
                  onClick={() => handleEdit(project._id)}
                >
                  <Edit className="w-4 h-4" /> Edit Project
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
