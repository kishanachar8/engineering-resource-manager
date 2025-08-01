import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Adjusted import path
import { Badge } from "@/components/ui/badge"; // Adjusted import path
import { formatDate } from "../../utils/date"; // Assuming this utility exists
import { Loader2, AlertCircle, Briefcase, Tag, Percent, CalendarDays } from "lucide-react"; // Added icons for visual flair

interface Project {
  _id: string;
  name: string;
  description?: string;
}

interface Assignment {
  _id: string;
  project: Project;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
}

export default function MyAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    if (!user?._id) {
      setLoading(false);
      setError("User not authenticated. Please log in to view your assignments.");
      return;
    }

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/assignments/engineer/${user._id}`);
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
        setError("Failed to load your assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user]); // Depend on the entire user object to re-fetch if user changes

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading your assignments...
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-10">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 text-center">
        My Project Assignments 📋
      </h2>

      {assignments.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-10">
          You currently have no active assignments.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {assignments.map((a) => (
            <Card key={a._id} className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" /> {a.project?.name || "Unnamed Project"}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                  {a.project?.description || "No description provided for this project."}
                </p>
              </CardHeader>

              <CardContent className="p-0 flex-grow space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-700 dark:text-purple-100 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {a.role}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Percent className="w-3 h-3" /> {a.allocationPercentage}% Allocation
                  </Badge>
                </div>

                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <strong>Start Date:</strong> {formatDate(a.startDate)}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <strong>End Date:</strong> {formatDate(a.endDate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
