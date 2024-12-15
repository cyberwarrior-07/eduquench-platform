import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  ClipboardList,
  Calendar,
  LayoutDashboard,
  MessageSquare,
  Settings,
  FolderOpen,
  GraduationCap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: GraduationCap },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  { name: 'Schedule', href: '/schedule', icon: Calendar },
  { name: 'Mentor Support', href: '/discussions', icon: MessageSquare },
  { name: 'Resources', href: '/resources', icon: FolderOpen },
];

export function StudentSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col gap-y-5 border-r bg-white p-5">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-gray-900">DESIGNO</span>
      </Link>

      <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>HS</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">Harsh</span>
          <span className="text-sm text-gray-500">Student</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className={cn(
              "justify-start gap-2",
              location.pathname === item.href
                ? "bg-primary text-white hover:bg-primary-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
            asChild
          >
            <Link to={item.href}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>

      <Button variant="ghost" className="justify-start gap-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  );
}