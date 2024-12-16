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
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 to-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-primary-100 rounded-full">
            <LogIn className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to DESIGNO
          </h2>
          <p className="text-center text-sm text-gray-600">
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
                borderRadius: '0.5rem',
                height: '2.75rem',
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
                margin: '1.5rem 0'
              },
              input: {
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
              },
              message: {
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                marginBottom: '1rem'
              },
              label: {
                color: '#374151',
                marginBottom: '0.5rem'
              }
            },
          }}
          providers={['google']}
          redirectTo={`${window.location.origin}/dashboard`}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;