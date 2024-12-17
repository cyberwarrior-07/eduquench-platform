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
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";

interface StudentSidebarProps {
  isCollapsed: boolean;
}

export function StudentSidebar({ isCollapsed }: StudentSidebarProps) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const links = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/student/dashboard",
    },
    {
      title: "Available Courses",
      icon: BookOpen,
      href: "/student/courses",
    },
    {
      title: "Live Sessions",
      icon: GraduationCap,
      href: "/student/live-sessions",
    },
    {
      title: "Schedule",
      icon: CalendarDays,
      href: "/student/schedule",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/student/settings",
    },
  ];

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  return (
    <div className="h-full bg-white">
      <div className="flex items-center justify-end p-4">
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleFullScreen}
          >
            {isFullScreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>
      
      <ScrollArea className="h-[calc(100%-4rem)] px-3">
        <nav className="space-y-1 py-4">
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
      </ScrollArea>
    </div>
  );
}