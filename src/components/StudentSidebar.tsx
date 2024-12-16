import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  BookOpen,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

export function StudentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const links = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Courses",
      icon: BookOpen,
      href: "/courses",
    },
    {
      title: "Live Sessions",
      icon: GraduationCap,
      href: "/live-sessions",
    },
    {
      title: "Schedule",
      icon: CalendarDays,
      href: "/schedule",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/settings",
    },
  ];

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
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {!isCollapsed && <span>{link.title}</span>}
            </NavLink>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}