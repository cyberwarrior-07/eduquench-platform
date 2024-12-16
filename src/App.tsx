import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import APISettings from "./pages/admin/APISettings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/settings" element={<AdminLayout><APISettings /></AdminLayout>} />
      </Routes>
    </Router>
  );
}
