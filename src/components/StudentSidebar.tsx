import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  Library,
  MessageSquare,
  PenBox,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

interface StudentSidebarProps {
  className?: string;
}

export const StudentSidebar = ({ className }: StudentSidebarProps) => {
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
      icon: Calendar,
      href: "/schedule",
    },
    {
      title: "Resources",
      icon: Library,
      href: "/resources",
    },
    {
      title: "Assignments",
      icon: PenBox,
      href: "/assignments",
    },
    {
      title: "Discussions",
      icon: MessageSquare,
      href: "/discussions",
    },
  ];

  return (
    <div
      className={cn(
        "relative flex flex-col h-full border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[60px]" : "w-[240px]",
        className
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
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                  isCollapsed && "justify-center"
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
};