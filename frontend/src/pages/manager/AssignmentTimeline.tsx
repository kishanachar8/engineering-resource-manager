import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { formatDate } from "../../utils/date"; // Assuming this utility exists
import { differenceInDays, parseISO, addMonths, format } from "date-fns"; // Added format for month labels
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Loader2, AlertCircle, User } from "lucide-react"; // Icons for visual flair

// Define types for better readability and type safety
interface RawAssignment {
  _id: string;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  engineerId: string;
  projectId: string;
}

interface Engineer {
  _id: string;
  name: string;
}

interface Project {
  _id: string;
  name: string;
}

interface Assignment {
  _id: string;
  role: string;
  allocationPercentage: number;
  startDate: string;
  endDate: string;
  engineer: { _id: string; name: string };
  project: { name: string };
}

// Generate consistent color per project
const colorMap = new Map<string, string>();
const colorPalette = [
  "#3B82F6", // blue-500
  "#10B981", // green-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#06B6D4", // cyan-500
  "#6B7280", // gray-500
];
let colorIndex = 0;

function getColor(projectName: string) {
  if (!colorMap.has(projectName)) {
    colorMap.set(projectName, colorPalette[colorIndex % colorPalette.length]);
    colorIndex++;
  }
  return colorMap.get(projectName)!;
}

export default function AssignmentTimeline() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Define the fixed timeline range for display
  const timelineStartDate = parseISO("2025-07-01"); // Start of July
  const timelineEndDate = parseISO("2025-12-31");   // End of December
  const totalDaysInTimeline = differenceInDays(timelineEndDate, timelineStartDate);

  // Generate month labels for the timeline header
  const getMonthLabels = () => {
    const labels = [];
    let currentMonth = timelineStartDate;
    while (currentMonth <= timelineEndDate) {
      labels.push(format(currentMonth, "MMM yy"));
      currentMonth = addMonths(currentMonth, 1);
    }
    return labels;
  };
  const monthLabels = getMonthLabels();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rawAssignmentsRes, engineersRes, projectsRes] = await Promise.all([
          API.get("/assignments"),
          API.get("/engineers"),
          API.get("/projects"),
        ]);

        const rawAssignments: RawAssignment[] = rawAssignmentsRes.data;
        const engineerMap: Record<string, Engineer> = Object.fromEntries(
          engineersRes.data.map((e: Engineer) => [e._id, e])
        );
        const projectMap: Record<string, Project> = Object.fromEntries(
          projectsRes.data.map((p: Project) => [p._id, p])
        );

        // Map raw assignments to enriched assignments with engineer and project details
        const enrichedAssignments: Assignment[] = rawAssignments.map((a: RawAssignment): Assignment => ({
          ...a,
          engineer: engineerMap[a.engineerId],
          project: projectMap[a.projectId],
        })).filter(a => a.engineer && a.project); // Filter out assignments with missing engineer/project data

        setAssignments(enrichedAssignments);
      } catch (err) {
        console.error("Failed to fetch data for timeline:", err);
        setError("Failed to load assignment timeline data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group assignments by engineer
  const assignmentsByEngineer = assignments.reduce((acc: Record<string, Assignment[]>, a) => {
    if (!a.engineer || !a.engineer._id) return acc; // Ensure engineer data exists
    if (!acc[a.engineer._id]) acc[a.engineer._id] = [];
    acc[a.engineer._id].push(a);
    return acc;
  }, {});

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Loading timeline data...
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
        Assignment Timeline 🗓️
      </h2>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 shadow-lg p-4">
        {/* Timeline Header with Month Labels */}
        <div className="flex text-xs font-semibold text-gray-600 dark:text-gray-400 mb-4 px-2">
          {monthLabels.map((label, index) => (
            <div key={index} className="flex-1 text-center border-r border-gray-200 dark:border-gray-700 last:border-r-0 py-1">
              {label}
            </div>
          ))}
        </div>

        {Object.entries(assignmentsByEngineer).length === 0 && !loading ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-10">No assignments to display on the timeline.</p>
        ) : (
          Object.entries(assignmentsByEngineer).map(([engineerId, list], i) => (
            <Card key={engineerId} className={`mb-6 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${i % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-850"}`}>
              <CardHeader className="p-0 mb-3">
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  {list[0].engineer.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                <div className="relative h-12 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                  {list.map((a) => {
                    const start = parseISO(a.startDate);
                    const end = parseISO(a.endDate);

                    // Calculate position relative to the overall timeline
                    const offsetDays = Math.max(differenceInDays(start, timelineStartDate), 0);
                    const durationDays = Math.max(differenceInDays(end, start), 1); // Ensure minimum 1 day duration

                    const left = (offsetDays / totalDaysInTimeline) * 100;
                    const width = (durationDays / totalDaysInTimeline) * 100;
                    const bgColor = getColor(a.project.name);

                    return (
                      <div
                        key={a._id}
                        className="absolute top-[10%] h-[80%] rounded-sm text-white text-xs px-2 py-0.5 flex items-center justify-center shadow-md truncate cursor-pointer group"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          backgroundColor: bgColor,
                        }}
                        title={`${a.project.name} - ${a.role} | ${formatDate(a.startDate)} → ${formatDate(a.endDate)} | Allocation: ${a.allocationPercentage}%`}
                      >
                        {/* Display project name and allocation, truncate if too long */}
                        <span className="font-medium">
                          {a.project.name.length > 18
                            ? `${a.project.name.slice(0, 15)}... (${a.allocationPercentage}%)`
                            : `${a.project.name} (${a.allocationPercentage}%)`}
                        </span>
                        {/* Optional: Add a tooltip for more details on hover */}
                        <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-md p-2 z-10 whitespace-nowrap -mt-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <p className="font-semibold">{a.project.name}</p>
                          <p>{a.role}</p>
                          <p>Allocation: {a.allocationPercentage}%</p>
                          <p>{formatDate(a.startDate)} &ndash; {formatDate(a.endDate)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
