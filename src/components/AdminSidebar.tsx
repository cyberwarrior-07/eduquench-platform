import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard,
  FileText,
  GraduationCap,
  Users,
  Settings,
  Database,
  ChevronLeft,
} from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'CMS Pages', href: '/admin/pages', icon: FileText },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'API Settings', href: '/admin/settings', icon: Database },
];

export function AdminSidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "relative flex flex-col h-full border-r bg-background",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="-right-4 z-10 rounded-full border shadow-md bg-background"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-all",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
      </div>

      <div className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <span className={cn(
            "text-xl font-bold text-primary transition-all",
            isCollapsed ? "hidden" : "block"
          )}>
            ADMIN CMS
          </span>
        </Link>
      </div>

      <div className={cn(
        "flex items-center gap-3 mx-4 rounded-lg border bg-gray-50 p-3",
        isCollapsed ? "justify-center" : ""
      )}>
        <Avatar>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
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
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            isCollapsed && "justify-center"
          )}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && "Settings"}
        </Button>
      </div>
    </div>
  );
}