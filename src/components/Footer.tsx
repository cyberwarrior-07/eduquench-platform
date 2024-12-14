import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/95">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-foreground/60 hover:text-foreground transition-colors">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="#" className="text-foreground/60 hover:text-foreground transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-foreground/60">
          © {new Date().getFullYear()} EduQuench. All rights reserved.
        </div>
      </div>
    </footer>
  );
};