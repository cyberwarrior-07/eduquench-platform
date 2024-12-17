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
import { useSidebar } from "./ui/sidebar";

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'CMS Pages', href: '/admin/pages', icon: FileText },
  { name: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'API Settings', href: '/admin/settings', icon: Database },
];

export function AdminSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="p-4">
        <Link to="/admin" className="flex items-center gap-2">
          <span className={cn(
            "text-lg font-semibold transition-all",
            collapsed ? "hidden" : "block"
          )}>
            Admin
          </span>
        </Link>
      </div>

      <div className={cn(
        "mx-4 flex items-center gap-3 rounded-md border bg-card p-3",
        collapsed ? "justify-center" : ""
      )}>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-medium">Admin</span>
            <span className="text-xs text-muted-foreground">Administrator</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
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
          size="sm"
          className={cn(
            "w-full justify-start gap-2",
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