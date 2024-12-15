import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            EduQuench
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/courses" className="text-gray-600 hover:text-gray-900 transition-colors">
            Courses
          </Link>
          <Link to="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link to="#" className="text-gray-600 hover:text-gray-900 transition-colors">
            Contact
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">Sign In</Button>
          <Button className="bg-primary hover:bg-primary-700">Get Started</Button>
        </div>
      </div>
    </header>
  );
};