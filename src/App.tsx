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
import { StudentSidebar } from "./components/StudentSidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./components/ui/button";

const queryClient = new QueryClient();

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  
  // Only show sidebar for LMS routes
  const isLMSRoute = !['/'].includes(location.pathname);

  return (
    <div className="flex min-h-screen">
      {isLMSRoute && (
        <>
          <div className={`relative transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <StudentSidebar />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-10 top-4 bg-white border shadow-sm hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
      <main className={`flex-1 overflow-y-auto transition-all duration-300 ${isLMSRoute ? 'pl-4' : ''}`}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/quizzes" element={<Quizzes />} />
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