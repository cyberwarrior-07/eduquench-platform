import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to DESIGNO
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: { background: '#4F46E5', color: 'white' },
              anchor: { color: '#4F46E5' },
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