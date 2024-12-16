import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Library,
  Video,
  GraduationCap,
  Clock
} from "lucide-react";

export const StudentSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: GraduationCap },
    { href: "/course-content", label: "Course Content", icon: BookOpen },
    { href: "/assignments", label: "Assignments", icon: FileText },
    { href: "/discussions", label: "Discussions", icon: MessageSquare },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/resources", label: "Resources", icon: Library },
    { href: "/live-sessions", label: "Live Sessions", icon: Video },
    { href: "/quizzes", label: "Quizzes", icon: Clock },
  ];

  return (
    <div className="pb-12 w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive(link.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};