import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ManagerDashboard() {
  const links = [
    { title: "Team Overview", path: "/manager/team" },
    { title: "Projects", path: "/manager/projects" },
    { title: "Create Assignment", path: "/manager/create-assignment" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {links.map((link, idx) => (
          <Link to={link.path} key={idx}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium group-hover:text-primary">{link.title}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
