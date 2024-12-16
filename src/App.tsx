import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import CMSLogin from "@/pages/auth/CMSLogin";
import StudentDashboard from "@/pages/student/Dashboard";
import Settings from "@/pages/student/Settings";
import Courses from "@/pages/Courses";
import CourseContent from "@/pages/CourseContent";
import CourseDetail from "@/pages/CourseDetail";
import LiveSessions from "@/pages/student/LiveSessions";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminCourses from "@/pages/admin/Courses";
import AdminUsers from "@/pages/admin/Users";
import AdminSettings from "@/pages/admin/Settings";
import AdminAnalytics from "@/pages/admin/Analytics";

const queryClient = new QueryClient();

function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <div className="flex w-full">
            <Sidebar className="flex-shrink-0">
              <SidebarContent>
                <StudentSidebar />
              </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
              <div className="container mx-auto max-w-7xl">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}

function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider>
          <div className="flex w-full">
            <Sidebar className="flex-shrink-0">
              <SidebarContent>
                <AdminSidebar />
              </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex-1 p-4 md:p-6 w-full overflow-x-hidden">
              <div className="container mx-auto max-w-7xl">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cms/login" element={<CMSLogin />} />
            
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/courses/:id/content" element={<CourseContent />} />
              <Route path="/live-sessions" element={<LiveSessions />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/courses" element={<AdminCourses />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}