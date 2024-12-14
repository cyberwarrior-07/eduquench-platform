import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  ClipboardList, 
  GraduationCap,
  Home,
  LayoutDashboard, 
  Settings, 
  User 
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Courses', href: '/courses', icon: BookOpen },
  { name: 'Assignments', href: '/assignments', icon: ClipboardList },
  { name: 'Quizzes', href: '/quizzes', icon: GraduationCap },
];

export function StudentSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen flex-col gap-y-5 border-r bg-background p-5">
      <Link to="/" className="flex items-center gap-2">
        <Home className="h-6 w-6" />
        <span className="text-xl font-bold">LMS</span>
      </Link>

      <div className="flex items-center gap-3 rounded-lg border p-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">Student Name</span>
          <span className="text-sm text-muted-foreground">student@example.com</span>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => (
          <Button
            key={item.name}
            variant={location.pathname === item.href ? "secondary" : "ghost"}
            className="justify-start gap-2"
            asChild
          >
            <Link to={item.href}>
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          </Button>
        ))}
      </nav>

      <Button variant="ghost" className="justify-start gap-2">
        <Settings className="h-4 w-4" />
        Settings
      </Button>
    </div>
  );
}