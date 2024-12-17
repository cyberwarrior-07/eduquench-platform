import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import CMSPages from "@/pages/admin/cms/index";
import CMSPageForm from "@/components/admin/cms/CMSPageForm";
import AdminCourses from "@/pages/admin/courses";
import AdminUsers from "@/pages/admin/users";
import AdminSettings from "@/pages/admin/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="pages" element={<CMSPages />} />
          <Route path="pages/new" element={<CMSPageForm />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
