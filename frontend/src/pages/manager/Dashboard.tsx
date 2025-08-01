import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  // Define the navigation links for the dashboard cards
  const links = [
    { title: "Team Overview", path: "/manager/team", description: "View and manage your team members." },
    { title: "Projects", path: "/manager/projects", description: "Monitor and update ongoing projects." },
    { title: "Create Assignment", path: "/manager/create-assignment", description: "Assign new tasks to engineers." },
    { title: "View Assignments", path: "/manager/view-assignments", description: "Track all current and past assignments." },
    { title: "Assignment Timeline", path: "/manager/timeline", description: "Visualize assignment schedules and deadlines." },
    { title: "Skill Gap Analysis", path: "/manager/skill-gap", description: "Identify skill deficiencies within your team." },
    { title: "Analytics & Reports", path: "/manager/analytics", description: "Access performance metrics and reports." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 sm:p-8 md:p-10">
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-8 text-center">
        Manager Dashboard 📊
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl mx-auto">
        {links.map((link, idx) => (
          <Link to={link.path} key={idx} className="block">
            <Card className="h-full flex flex-col justify-between p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-700 group">
              <CardContent className="p-0"> {/* Remove default padding from CardContent */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-semibold text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors duration-200">
                    {link.title}
                  </span>
                  <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {link.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
