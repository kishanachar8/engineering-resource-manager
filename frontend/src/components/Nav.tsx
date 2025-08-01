import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { MenuIcon, LogOutIcon } from "lucide-react"; // Import LogOutIcon for clarity
import { Button } from "../components/ui/button";

export default function Nav() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const role = user?.role;

  // Grouping similar links for better organization, if desired in the future
  const managerLinks = [
    { label: "Dashboard", path: "/manager/dashboard" },
    { label: "Team", path: "/manager/team" },
    { label: "Projects", path: "/manager/projects" },
    { label: "Assignments", path: "/manager/view-assignments" },
    { label: "Assign New", path: "/manager/create-assignment" }, // Renamed for clarity
    { label: "Timeline", path: "/manager/timeline" }, // Shortened label
    { label: "Skill Gap", path: "/manager/skill-gap" },
    { label: "Analytics", path: "/manager/analytics" }, // Moved for better flow
  ];

  const engineerLinks = [
    { label: "Dashboard", path: "/engineer/dashboard" },
    { label: "My Assignments", path: "/engineer/assignments" },
    { label: "Profile", path: "/engineer/profile" },
  ];

  const links = role === "manager" ? managerLinks : role === "engineer" ? engineerLinks : [];

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-14">
        <Link to={role === "manager" ? "/manager/dashboard" : role === "engineer" ? "/engineer/dashboard" : "/"}
          className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Resourcify {/* Catchier name for the app */}
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex items-center space-x-6">
            {links.map((link) => (
              <NavigationMenuItem key={link.path}>
                <Link to={link.path} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2 px-3 rounded-md">
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          {/* Mobile Navigation Dropdown */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-2">
                {links.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link to={link.path} className="flex items-center gap-2 p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200 cursor-pointer"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Logout Button (Desktop) */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="hidden md:flex items-center gap-2 text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
          >
            <LogOutIcon className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}