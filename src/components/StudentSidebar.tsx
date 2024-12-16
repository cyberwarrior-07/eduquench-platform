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
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useState } from "react";

export function StudentSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    <div className={cn(
      "relative h-full bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed ? "rotate-180" : "rotate-0"
            )}
          />
        </Button>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
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
      </ScrollArea>
    </div>
  );
}