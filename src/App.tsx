import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StudentLayout } from "@/layouts/StudentLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CMSPages from "@/pages/admin/cms/index";
import CMSPageForm from "@/components/admin/cms/CMSPageForm";
import AdminCourses from "@/pages/admin/courses";
import CourseForm from "@/pages/admin/courses/CourseForm";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/Settings";
import StudentDashboard from "@/pages/student/Dashboard";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import CourseContent from "@/pages/CourseContent";
import LiveSessions from "@/pages/student/LiveSessions";
import StudentQuizzes from "@/pages/student/Quizzes";
import StudentSchedule from "@/pages/student/Schedule";
import StudentSettings from "@/pages/student/Settings";
import Discussions from "@/pages/Discussions";
import Resources from "@/pages/Resources";
import Assignments from "@/pages/Assignments";
import Quizzes from "@/pages/Quizzes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pages" element={<CMSPages />} />
          <Route path="pages/new" element={<CMSPageForm />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseForm />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Student routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="courses/:courseId/content" element={<CourseContent />} />
          <Route path="live-sessions" element={<LiveSessions />} />
          <Route path="quizzes" element={<StudentQuizzes />} />
          <Route path="schedule" element={<StudentSchedule />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="discussions" element={<Discussions />} />
          <Route path="resources" element={<Resources />} />
          <Route path="assignments" element={<Assignments />} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}