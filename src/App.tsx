import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import APISettings from "./pages/admin/APISettings";
import CourseList from "./pages/admin/courses/CourseList";
import CourseForm from "./pages/admin/courses/CourseForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<APISettings />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;