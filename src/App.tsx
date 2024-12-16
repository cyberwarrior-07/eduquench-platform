import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Assignments from "./pages/Assignments";
import Quizzes from "./pages/Quizzes";
import Schedule from "./pages/Schedule";
import Discussions from "./pages/Discussions";
import Resources from "./pages/Resources";
import CourseContent from "./pages/CourseContent";
import { StudentSidebar } from "./components/StudentSidebar";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  const isLMSRoute = !['/'].includes(location.pathname);
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Add other admin routes here */}
        </Routes>
      </AdminLayout>
    );
  }

  return (
    <div className="flex min-h-screen">
      {isLMSRoute && (
        <div className={`fixed h-full transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
          <StudentSidebar />
          <div className="fixed left-64 top-1/2 -translate-y-1/2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-6 bg-white border shadow-sm hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      )}
      <main className={`flex-1 transition-all duration-300 ${isLMSRoute ? (sidebarOpen ? 'ml-64' : 'ml-0') : ''}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/quizzes" element={<Quizzes />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/course/:id" element={<CourseContent />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;