import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import APISettings from "./pages/admin/APISettings";
import CourseList from "./pages/admin/courses/CourseList";
import CourseForm from "./pages/admin/courses/CourseForm";
import Login from "./pages/auth/Login";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { toast } from "sonner";

function ProtectedRoute({ allowedRoles, children }: { allowedRoles: string[], children: JSX.Element }) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        getUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        getUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserRole = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserRole(profile?.role);
    } catch (error) {
      toast.error('Error fetching user role');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole as string)) {
    return <Navigate to="/" />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout><Outlet /></AdminLayout>
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="settings" element={<APISettings />} />
          <Route path="courses" element={<CourseList />} />
          <Route path="courses/new" element={<CourseForm />} />
          <Route path="courses/:id" element={<CourseForm />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;