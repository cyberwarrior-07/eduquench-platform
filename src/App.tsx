import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import APISettings from "./pages/admin/APISettings";
import CourseList from "./pages/admin/courses/CourseList";
import CourseForm from "./pages/admin/courses/CourseForm";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import StudentDashboard from "./pages/student/Dashboard";
import Assignments from "./pages/Assignments";
import CourseContent from "./pages/CourseContent";
import Discussions from "./pages/Discussions";
import Resources from "./pages/Resources";
import Schedule from "./pages/Schedule";
import Quizzes from "./pages/Quizzes";
import LiveSessions from "./pages/student/LiveSessions";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "./integrations/supabase/client";
import { Toaster } from "sonner";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

// Create a StudentLayout component for consistent sidebar across student pages
const StudentLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <StudentSidebar />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/courses" element={<Courses />} />
          
          {/* Student routes - wrapped with StudentLayout */}
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/course-content" element={<CourseContent />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/quizzes" element={<Quizzes />} />
            <Route path="/live-sessions" element={<LiveSessions />} />
          </Route>
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<APISettings />} />
            <Route path="courses" element={<CourseList />} />
            <Route path="courses/new" element={<CourseForm />} />
            <Route path="courses/:id" element={<CourseForm />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </SessionContextProvider>
  );
}

export default App;