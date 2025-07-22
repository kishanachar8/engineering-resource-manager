import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "../components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { useAuthStore } from "../store/authStore"
import { useNavigate, Link } from "react-router-dom"
import { MenuIcon } from "lucide-react"
import { Button } from "../components/ui/button"

export default function Nav() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const role = user?.role

  const managerLinks = [
    { label: "Dashboard", path: "/manager/dashboard" },
    { label: "Team", path: "/manager/team" },
    { label: "Projects", path: "/manager/projects" },
    { label: "Assign", path: "/manager/create-assignment" },
    { label: "Analytics", path: "/manager/analytics" },
    { label: "Assignments", path: "/manager/view-assignments" },
    { label: "Assignment Timeline", path: "/manager/timeline" },
    { label: "Skill Gap", path: "/manager/skill-gap" },
  ]

  const engineerLinks = [
    { label: "Dashboard", path: "/engineer/dashboard" },
    { label: "My Assignments", path: "/engineer/assignments" },
    { label: "Profile", path: "/engineer/profile" },
  ]

  const links = role === "manager" ? managerLinks : role === "engineer" ? engineerLinks : []

  return (
    <nav className="bg-white border-b shadow-sm px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="#" className="text-xl font-bold text-blue-600">
          Engineering Resource Manager
        </Link>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="space-x-4">
            {links.map((link) => (
              <NavigationMenuItem key={link.path}>
                <Link to={link.path} className="text-sm text-gray-700 hover:text-blue-600">
                  {link.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile nav dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {links.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link to={link.path} className="w-full">
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Logout (desktop only) */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="hidden md:inline-block text-red-600 border-red-600 hover:bg-red-100 ml-6"
        >
          Logout
        </Button>
      </div>
    </nav>
  )
}
