import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjusted import path
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle, Briefcase, User } from "lucide-react"; // Added icons

interface Project {
  _id: string;
  name: string;
  description: string;
}

interface Assignment {
  _id: string;
  projectId: Project;
  startDate: string;
  endDate: string;
  allocationPercentage: number;
  role: string;
}

export default function EngineerDashboard() {
  const userId = useAuthStore((state) => state.user?._id);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("User not authenticated. Please log in.");
      return;
    }

    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/assignments/engineer/${userId}`);
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments", err);
        setError("Failed to load your assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [userId]);

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading your dashboard...
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
        Engineer Dashboard 🚀
      </h2>

      {assignments.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-10">
          You currently have no assignments.
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
          {/* Card linking to My Assignments */}
          <Link to={`/engineer/assignments`} className="block">
            <Card className="h-full flex flex-col justify-between p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 group">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Briefcase className="w-6 h-6" /> My Assignments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  View all your assigned projects and their details.
                </p>
                <div className="flex items-center justify-end">
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* You can add more cards here for other engineer-specific actions/overviews */}
          {/* Example: Link to Profile */}
          <Link to={`/engineer/profile`} className="block">
            <Card className="h-full flex flex-col justify-between p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 group">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                  <User className="w-6 h-6" /> My Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Manage your personal information and skills.
                </p>
                <div className="flex items-center justify-end">
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  );
}
