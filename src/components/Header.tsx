import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
            EduQuench
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/courses" className="text-foreground/60 hover:text-foreground transition-colors">
            Courses
          </Link>
          <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </header>
  );
};