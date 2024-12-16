import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import APISettings from "./pages/admin/APISettings";
import CourseList from "./pages/admin/courses/CourseList";
import CourseForm from "./pages/admin/courses/CourseForm";
import Index from "./pages/Index";
import Courses from "./pages/Courses";
import StudentDashboard from "./pages/student/Dashboard";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<APISettings />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;