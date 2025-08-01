import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { z } from "zod"; // Import z for schema definition
import API from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { Input } from "@/components/ui/input"; // Adjusted import path
import { Button } from "@/components/ui/button"; // Adjusted import path
import { Badge } from "@/components/ui/badge"; // Adjusted import path
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"; // Adjusted import path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components for seniority
import { Loader2, AlertCircle, User, Mail, Briefcase, Award, Tag, Edit, Save } from "lucide-react"; // Added icons
import { Label } from "recharts";

// Zod schema for form validation
const profileUpdateSchema = z.object({
  skills: z.string().min(1, "Skills are required (comma-separated)."),
  seniority: z.string().min(1, "Seniority level is required."),
});

type FormData = z.infer<typeof profileUpdateSchema>;

type EngineerProfile = {
  name: string;
  email: string;
  role: "engineer" | "manager";
  skills: string[];
  seniority: string;
};

export default function EngineerProfile() {
  const { user } = useAuthStore();
  const userId = user?._id;
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(profileUpdateSchema), // Apply Zod resolver
  });
  const [profile, setProfile] = useState<EngineerProfile | null>(null);
  const [loading, setLoading] = useState(true); // For initial data fetch
  const [formLoading, setFormLoading] = useState(false); // For form submission
  const [error, setError] = useState<string | null>(null); // For global errors

  // Fetch engineer profile data
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User not authenticated. Please log in.");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/engineers/${userId}`);
        setProfile(res.data);
        // Set form values after fetching data
        setValue("skills", res.data.skills.join(", "));
        setValue("seniority", res.data.seniority);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, setValue]); // Add setValue to dependency array

  // Handle form submission for profile update
  const onSubmit = async (data: FormData) => {
    setFormLoading(true);
    setError(null); // Clear previous errors
    const updated = {
      skills: data.skills.split(",").map((s) => s.trim()).filter(s => s !== ''), // Filter out empty strings
      seniority: data.seniority,
    };

    try {
      await API.put(`/engineers/${userId}`, updated);
      // Re-fetch profile to display updated data
      const res = await API.get(`/engineers/${userId}`);
      setProfile(res.data);
      // TODO: Replace with a user-friendly toast notification or modal
      alert("Profile updated successfully!"); // Temporary alert
    } catch (err) {
      console.error("Failed to update profile:", err);
      // TODO: Replace with a user-friendly toast notification or modal
      alert("Failed to update profile. Please try again."); // Temporary alert
      setError("Failed to update profile. Please check your inputs.");
    } finally {
      setFormLoading(false);
    }
  };

  // Seniority levels (example, ideally fetched from meta API)
  const seniorityLevels = ["Junior", "Mid", "Senior", "Lead", "Principal"];


  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading profile...
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-xl font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
          <AlertCircle /> Error: {error}
        </div>
      </div>
    );
  }

  // If profile is null after loading and no error, means user not found or something went wrong
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Profile not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-10">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 text-center">
        My Profile 👤
      </h2>

      <Card className="max-w-2xl mx-auto rounded-xl shadow-lg bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
        <CardHeader className="p-6 pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Engineer Details
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-6">
          {/* Profile Information Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base text-gray-700 dark:text-gray-300">
            <p className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <strong>Role:</strong> {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </p>
            <p className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <strong>Seniority:</strong> {profile.seniority}
            </p>
          </div>

          {/* Profile Update Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
              <Edit className="w-5 h-5 text-purple-600 dark:text-purple-400" /> Update Information
            </h3>

            {/* Seniority Level Select */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Seniority Level</Label>
              <Select onValueChange={(val) => setValue("seniority", val, { shouldValidate: true })} value={profile.seniority}>
                <SelectTrigger id="seniority" className="w-full dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
                  <SelectValue placeholder="Select Seniority" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                  {seniorityLevels.map((level) => (
                    <SelectItem key={level} value={level} className="dark:text-gray-200 hover:dark:bg-gray-700">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.seniority && <p className="text-sm text-red-500 mt-1">{errors.seniority.message}</p>}
            </div>

            {/* Skills Input */}
            <div>
              <Label  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Skills (comma-separated)</Label>
              <Input
                id="skills"
                {...register("skills")}
                placeholder="e.g., React, Node.js, AWS, TypeScript"
                className="dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
              />
              {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills.message}</p>}
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200 ease-in-out transform hover:scale-105 mt-4"
              disabled={formLoading}
            >
              {formLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {formLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>

          {/* Current Skills Display */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2 mb-3">
              <Tag className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Current Skills:
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No skills added yet.</p>
              ) : (
                profile.skills.map((skill, idx) => (
                  <Badge key={idx} className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
