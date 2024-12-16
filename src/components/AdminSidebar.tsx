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
import { ScrollArea } from "./ui/scroll-area";
import { useSidebarContext } from "./ui/sidebar";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'CMS Pages', href: '/admin/pages', icon: FileText },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'API Settings', href: '/admin/settings', icon: Database },
];

export function AdminSidebar() {
  const location = useLocation();
  const { collapsed } = useSidebarContext();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <span className={cn(
            "text-xl font-bold text-primary transition-all",
            collapsed ? "hidden" : "block"
          )}>
            ADMIN CMS
          </span>
        </Link>
      </div>

      <div className={cn(
        "flex items-center gap-3 mx-4 rounded-lg border bg-gray-50 p-3",
        collapsed ? "justify-center" : ""
      )}>
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">Admin</span>
            <span className="text-sm text-gray-500">Administrator</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                location.pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            collapsed && "justify-center"
          )}
        >
          <Settings className="h-4 w-4" />
          {!collapsed && "Settings"}
        </Button>
      </div>
    </div>
  );
}