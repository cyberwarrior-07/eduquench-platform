import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          handleUserSession(session);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast.error('Error checking session');
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        handleUserSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleUserSession = async (session: any) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        switch (profile.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'mentor':
            navigate('/mentor');
            break;
          case 'student':
          default:
            navigate('/dashboard');
            break;
        }
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      toast.error('Error fetching user role');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white p-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2 bg-primary-50 rounded-full">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-center text-2xl font-medium text-gray-900">
            Welcome to EduQuench
          </h2>
          <p className="text-center text-sm text-gray-500">
            Sign in to access your account
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { 
                background: '#FF4500',
                color: 'white',
                borderRadius: '0.375rem',
                height: '2.5rem',
              },
              anchor: { 
                color: '#FF4500',
                fontWeight: '500'
              },
              container: {
                width: '100%'
              },
              divider: {
                background: '#E5E7EB',
                margin: '1rem 0'
              },
              input: {
                borderRadius: '0.375rem',
                padding: '0.625rem 0.875rem',
              },
              message: {
                borderRadius: '0.375rem',
                padding: '0.625rem 0.875rem',
                marginBottom: '0.75rem'
              },
              label: {
                color: '#374151',
                marginBottom: '0.375rem'
              }
            },
          }}
          providers={['google']}
          redirectTo={window.location.origin}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;