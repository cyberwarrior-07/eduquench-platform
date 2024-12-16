import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  FileText,
  GraduationCap,
  Users,
  Settings,
  Database,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'CMS Pages', href: '/admin/pages', icon: FileText },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'API Settings', href: '/admin/settings', icon: Database },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col gap-y-5 border-r bg-white p-5">
      <Link to="/admin" className="flex items-center gap-2">
        <span className="text-xl font-bold text-primary">ADMIN CMS</span>
      </Link>

      <div className="flex items-center gap-3 rounded-lg border bg-gray-50 p-3">
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-gray-900">Admin</span>
          <span className="text-sm text-gray-500">Administrator</span>
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