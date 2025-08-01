import { useEffect, useState } from "react";
import API from "../../lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Adjusted import path for Card components
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported from Shadcn UI
import { Loader2, AlertCircle, Lightbulb, CheckCircle, XCircle, Briefcase } from "lucide-react"; // Icons for visual flair

// Define types for better readability and type safety
type Engineer = {
  _id: string;
  name: string;
  email: string;
  role: "engineer";
  skills: string[];
  seniority: string;
  maxCapacity: number;
  currentCapacity: number;
};

type Project = {
  _id: string;
  name: string;
  description: string;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "planning" | "on-hold"; // Added 'planning' for consistency
};

export default function SkillGap() {
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error messages

  // Fetch engineers and projects data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [projectsRes, engineersRes] = await Promise.all([
          API.get("/projects"),
          API.get("/engineers"),
        ]);
        setProjects(projectsRes.data);
        setEngineers(engineersRes.data);
      } catch (err) {
        console.error("Failed to fetch skill gap data:", err);
        setError("Failed to load skill gap analysis data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper function to get skills that match between required and available engineer skills
  const getMatchingSkills = (required: string[], engineerSkills: string[]) =>
    required.filter((skill) => engineerSkills.includes(skill));

  // Helper function to get skills that are missing from the required list among all engineer skills
  const getMissingSkills = (required: string[], allEngineerSkills: string[]) =>
    required.filter((skill) => !allEngineerSkills.includes(skill));

  // Display loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin" /> Analyzing skill gaps...
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
        Skill Gap Analysis 🧠
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
        {projects.length === 0 && !loading ? (
          <p className="lg:col-span-2 text-center text-gray-600 dark:text-gray-400 text-lg py-10">
            No projects found to perform skill gap analysis.
          </p>
        ) : (
          projects.map((project) => {
            // Get all unique skills from all engineers
            const allEngineerSkills = Array.from(new Set(engineers.flatMap((e) => e.skills)));
            const matched = getMatchingSkills(project.requiredSkills, allEngineerSkills);
            const missing = getMissingSkills(project.requiredSkills, allEngineerSkills);

            return (
              <Card key={project._id} className="p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                      <Briefcase className="w-6 h-6" /> {project.name}
                    </CardTitle>
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
                  <div className="mb-4">
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-gray-500 dark:text-gray-400" /> Required Skills:
                    </h4>
                    <div className="flex gap-2 flex-wrap">
                      {project.requiredSkills.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No skills specified for this project.</p>
                      ) : (
                        project.requiredSkills.map((skill: string) => (
                          <Badge
                            key={skill}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                              matched.includes(skill)
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100"
                                : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100"
                            }`}
                          >
                            {skill}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="text-sm space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Matched:{" "}
                      {matched.length ? (
                        <span className="text-gray-800 dark:text-gray-200">{matched.join(", ")}</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">None</span>
                      )}
                    </p>
                    <p className="text-red-600 dark:text-red-400 font-medium flex items-center gap-2">
                      <XCircle className="w-4 h-4" /> Missing:{" "}
                      {missing.length ? (
                        <span className="text-gray-800 dark:text-gray-200">{missing.join(", ")}</span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">None</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
