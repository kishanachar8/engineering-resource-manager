import { useEffect, useState } from "react";
import API from "../../lib/axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Loader2, AlertCircle, Users, LayoutDashboard } from "lucide-react"; // Icons for visual flair
// import { util } from "zod/v4/core";

// Custom status-based colors for the Pie Chart
const STATUS_COLORS: Record<string, string> = {
  active: "#EF4444",    // Red for active projects (more urgent)
  completed: "#10B981", // Green for completed projects
  "on-hold": "#F59E0B", // Amber for on-hold projects
  planning: "#3B82F6",  // Blue for planning projects (added for consistency with Project type)
};

// Define types for better readability and type safety
type Engineer = {
  _id: string;
  name: string;
  email: string;
  role: "engineer";
  skills: string[];
  seniority: string;
  maxCapacity: number;
};

type Assignment = {
  _id: string;
  engineerId: string;
  allocationPercentage: number;
  status: "active" | "completed"; // Assuming assignment status is simpler than project status
};

type Project = {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "on-hold" | "planning"; // Ensure 'planning' is included
};

export default function Analytics() {
  const [engineers, setEngineers] = useState<(Engineer & { currentCapacity: number })[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch all necessary data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [engRes, assignRes, projRes] = await Promise.all([
          API.get("/engineers"),
          API.get("/assignments"),
          API.get("/projects"),
        ]);

        const fetchedEngineers: Engineer[] = engRes.data;
        const fetchedAssignments: Assignment[] = assignRes.data;
        const fetchedProjects: Project[] = projRes.data;

        // Calculate current capacity for each engineer
        const engineersWithCapacity = fetchedEngineers.map((eng) => {
          const engAssignments = fetchedAssignments.filter(
            (a) => a.engineerId === eng._id && a.status === "active" // Only consider active assignments for current capacity
          );
          const currentCapacity = engAssignments.reduce(
            (sum, a) => sum + a.allocationPercentage,
            0
          );
          return { ...eng, currentCapacity };
        });

        setEngineers(engineersWithCapacity);
        setProjects(fetchedProjects);
      } catch (err) {
        console.error("Failed to fetch analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Prepare data for Team Utilization Bar Chart
  const teamUtilData = engineers.map((e) => ({
    name: e.name || "Unnamed Engineer",
    utilized: e.currentCapacity,
    available: Math.max(e.maxCapacity - e.currentCapacity, 0),
  }));
  console.log(teamUtilData);

  // Prepare data for Project Status Pie Chart
  const statusCount: Record<Project["status"], number> = {
    active: 0,
    completed: 0,
    "on-hold": 0,
    planning: 0, // Initialize planning status count
  };

  projects.forEach((p) => {
    // This line is syntactically correct and robust.
    // It checks if the project status (p.status) is a known property in the statusCount object.
    // If it is, it increments the count for that status.
    // If not (e.g., an unexpected status from the API), it falls back to incrementing 'planning'.
    if (Object.prototype.hasOwnProperty.call(statusCount, p.status)) {
      statusCount[p.status] = (statusCount[p.status] || 0) + 1;
    } else {
      // Fallback for unexpected status, or add it if dynamic
      statusCount.planning = (statusCount.planning || 0) + 1;
    }
  });

  const projectStatusData = Object.entries(statusCount).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '), // Capitalize and format name
    value,
  }));

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading analytics...
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
        Analytics Dashboard 📈
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* Team Utilization Chart Card */}
        <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" /> Team Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {teamUtilData.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-10">No engineer data available for utilization.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamUtilData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:stroke-gray-700" />
                  {/* Replaced custom CSS variables with direct Tailwind colors for better compatibility */}
                  <XAxis dataKey="name" tick={{ fill: '#4B5563' }} className="dark:text-gray-300" /> {/* gray-700 */}
                  <YAxis tick={{ fill: '#4B5563' }} className="dark:text-gray-300" /> {/* gray-700 */}
                  <Tooltip
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                    // Replaced custom CSS variables with direct Tailwind colors for better compatibility
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem' }} // dark:bg-gray-800, dark:border-gray-700
                    labelStyle={{ color: '#F9FAFB' }} // dark:text-gray-50
                    itemStyle={{ color: '#F9FAFB' }} // dark:text-gray-50
                  />
                  {/* Replaced custom CSS variables with direct Tailwind colors for better compatibility */}
                  <Legend wrapperStyle={{ color: '#4B5563' }} /> {/* gray-700 */}
                  <Bar dataKey="utilized" fill="#3B82F6" name="Utilized (%)" radius={[4, 4, 0, 0]} /> {/* blue-500 */}
                  <Bar dataKey="available" fill="#93C5FD" name="Available (%)" radius={[4, 4, 0, 0]} /> {/* blue-300 */}
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Project Status Chart Card */}
        <Card className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50 flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6 text-purple-600 dark:text-purple-400" /> Project Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {projectStatusData.length === 0 || projectStatusData.every(d => d.value === 0) ? (
              <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-10">No project data available for status breakdown.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    labelLine={false} // Hide label lines for cleaner look
                    // The label format line is syntactically correct.
                    // If labels are overlapping, it's a rendering challenge with Recharts' label positioning.
                    // For better visibility, consider increasing chart size or using a custom label component.
                    label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`} // Custom label format
                  >
                    {projectStatusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name.toLowerCase().replace(' ', '-')] || "#8884d8"} // Use lowercase, hyphenated name for color map lookup
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    // Replaced custom CSS variables with direct Tailwind colors for better compatibility
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem' }} // dark:bg-gray-800, dark:border-gray-700
                    labelStyle={{ color: '#F9FAFB' }} // dark:text-gray-50
                    itemStyle={{ color: '#F9FAFB' }} // dark:text-gray-50
                  />
                  {/* Replaced custom CSS variables with direct Tailwind colors for better compatibility */}
                  <Legend wrapperStyle={{ color: '#4B5563' }} /> {/* gray-700 */}
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
