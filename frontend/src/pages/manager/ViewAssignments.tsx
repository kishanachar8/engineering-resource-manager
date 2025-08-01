import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjusted import path
import { formatDate } from "../../utils/date"; // Assuming this utility exists
import { Loader2, AlertCircle, User, Briefcase, Percent, CalendarDays, Tag } from "lucide-react"; // Icons for visual flair

// Define types for better readability and type safety
type Assignment = {
  _id: string;
  engineer: {
    _id: string;
    name: string;
    email?: string; // Optional: could add email for contact
  };
  project: {
    _id: string;
    name: string;
  };
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
};

export default function ViewAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch assignments data on component mount
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await API.get("/assignments");
        setAssignments(res.data);
      } catch (err) {
        console.error("Failed to fetch assignments:", err);
        setError("Failed to load assignments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading assignments...
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
        All Assignments 📋
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {assignments.length === 0 && !loading && (
          <p className="md:col-span-full text-center text-gray-600 dark:text-gray-400 text-lg">No assignments found.</p>
        )}
        {assignments.map((a) => (
          <Card key={a._id} className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {a.engineer?.name} <span className="text-gray-500 dark:text-gray-400 font-normal text-lg mx-1">→</span> {a.project?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <p className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <strong>Engineer:</strong> {a.engineer?.name}
              </p>
              <p className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <strong>Project:</strong> {a.project?.name}
              </p>
              <p className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <strong>Role:</strong> <span className="font-medium text-purple-600 dark:text-purple-400">{a.role}</span>
              </p>
              <p className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <strong>Allocation:</strong> <span className="font-medium text-green-600 dark:text-green-400">{a.allocationPercentage}%</span>
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <strong>Start Date:</strong> {formatDate(a.startDate)}
              </p>
              <p className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <strong>End Date:</strong> {formatDate(a.endDate)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
