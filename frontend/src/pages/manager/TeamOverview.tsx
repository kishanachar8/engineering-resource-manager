import { useEffect, useState } from 'react'; // Import useState for potential loading/error states
import API from '../../lib/axios';
import { useUserStore } from '../../store/userStore';
import { useAssignmentStore } from '../../store/assignmentStore';
import CapacityBar from '../../components/CapacityBar'; // Assuming this component exists and is styled well
import SkillTags from '../../components/SkillTags'; // Assuming this component exists and is styled well
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components for consistent styling
import { Badge } from "@/components/ui/badge"; // For employmentType badge
import { ArrowRight } from 'lucide-react'; // Icons for visual flair
import { Link } from 'react-router-dom';

// Define types for better readability and type safety
interface Engineer {
  _id: string;
  name: string;
  seniority: string;
  employmentType: string;
  maxCapacity: number;
  skills: string[];
  email: string; // Assuming email might be useful for a contact link
  department: string; // Added department property
}

interface Assignment {
  engineerId: string;
  allocationPercentage: number;
  // Add other assignment properties if needed for display
}

export default function TeamOverview() {
  const { users, setUsers } = useUserStore();
  const { assignments, setAssignments } = useAssignmentStore();
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch users and assignments data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const usersRes = await API.get('/engineers');
        const assignRes = await API.get('/assignments');
        setUsers(usersRes.data);
        setAssignments(assignRes.data);
      } catch (err) {
        console.error("Failed to fetch team data:", err);
        setError("Failed to load team data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setUsers, setAssignments]); // Add dependencies for useEffect

  // Helper function to calculate used capacity for an engineer
  const calculateUsedCapacity = (engineerId: string) => {
    const engineerAssignments = assignments.filter((a: Assignment) => a.engineerId === engineerId);
    return engineerAssignments.reduce((total, a) => total + a.allocationPercentage, 0);
  };

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading team data...
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-xl font-semibold text-red-700 dark:text-red-400">
          Error: {error}
        </div>
      </div>
    );
  }

  // Display message if no engineers are found
  if (users.length === 0 && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          No engineers found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-10">
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 text-center">
        Team Overview 👥
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {(users as Engineer[]).map((engineer) => {
          const used = calculateUsedCapacity(engineer._id);
          const available = engineer.maxCapacity - used;

          return (
            <Card key={engineer._id} className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
              <CardHeader className="p-0 mb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {engineer.name}
                  </CardTitle>
                  <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 px-3 py-1 rounded-full text-xs font-semibold">
                    {engineer.employmentType}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {engineer.seniority} Engineer
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {engineer.department} Department
                </p>
              </CardHeader>

              <CardContent className="p-0 flex-grow">
                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Capacity</h4>
                  <CapacityBar used={used} max={engineer.maxCapacity} />
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <span>Allocated: <span className="font-medium text-blue-600 dark:text-blue-300">{used}%</span></span>
                    <span>Available: <span className="font-medium text-green-600 dark:text-green-300">{available}%</span></span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">Skills</h4>
                  <SkillTags skills={engineer.skills} />
                </div>

                {/* Optional: Add a link to engineer's profile or assignments */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link to={`/engineer/${engineer._id}/profile`} className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200 text-sm font-medium">
                    View Profile <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
