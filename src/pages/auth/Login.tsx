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
    <div className="min-h-screen bg-gradient-to-b from-primary-100 via-background to-secondary">
      <Header />
      <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md p-8 space-y-8 shadow-xl bg-white/95 backdrop-blur-sm border-primary/10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-primary">Welcome to EduQuench</h2>
            <p className="text-sm text-muted-foreground">
              Sign in to your account to continue learning
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
                    brandButtonText: 'white',
                    defaultButtonBackground: '#F8FAFC',
                    defaultButtonBackgroundHover: '#F1F5F9',
                    inputBackground: 'white',
                    inputBorder: '#E2E8F0',
                    inputBorderHover: '#FF4500',
                    inputBorderFocus: '#FF4500',
                  },
                  radii: {
                    borderRadiusButton: '0.5rem',
                    buttonBorderRadius: '0.5rem',
                    inputBorderRadius: '0.5rem',
                  },
                },
              },
              className: {
                container: 'w-full',
                button: 'w-full px-4 py-2.5 rounded-lg font-medium transition-colors',
                divider: 'my-6',
                label: 'text-sm font-medium text-gray-700',
                input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                message: 'text-sm text-red-500',
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