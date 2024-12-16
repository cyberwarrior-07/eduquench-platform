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
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useState } from "react";

export function StudentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const links = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Available Courses",
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
    <div className={cn(
      "relative h-full bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-4 z-20 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-50"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            isCollapsed ? "rotate-180" : "rotate-0"
          )}
        />
      </Button>
      
      <ScrollArea className="h-full px-3 py-4">
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-gray-100",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:text-gray-900"
                )
              }
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{link.title}</span>}
            </NavLink>
          ))}
        </nav>

        {!isCollapsed && (
          <div className="mt-4 flex items-center justify-between px-3 py-2">
            <span className="text-sm text-gray-600">Dark Mode</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="h-8 w-8"
            >
              {isDarkMode ? (
                <ToggleRight className="h-5 w-5 text-primary" />
              ) : (
                <ToggleLeft className="h-5 w-5 text-gray-400" />
              )}
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}