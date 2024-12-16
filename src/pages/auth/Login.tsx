import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted');
    
    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Current session:', session);
      if (session) {
        handleAuthChange(session);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthChange = async (session: any) => {
    if (session) {
      try {
        console.log('Fetching user profile for:', session.user.id);
        
        // Get user role from profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast.error('Error fetching user profile');
          return;
        }

        console.log('User profile:', profile);

        if (profile) {
          // Redirect based on role
          if (profile.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
          toast.success('Successfully logged in');
        }
      } catch (error) {
        console.error('Error in auth change:', error);
        toast.error('Error during authentication');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-8 space-y-8 shadow-lg bg-white/50 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Welcome to EduQuench</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          
          <div className="p-4 bg-primary-100 rounded-lg">
            <p className="text-sm text-primary-800">
              <strong>Demo Credentials:</strong><br />
              Email: demo@eduquench.com<br />
              Password: demo123
            </p>
          </div>

          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#FF4500',
                    brandAccent: '#FF612F',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2 rounded-md',
                divider: 'my-4',
                label: 'text-sm font-medium text-gray-700',
                input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              },
            }}
            providers={[]}
            theme="light"
          />
        </Card>
      </div>
    </div>
  );
}