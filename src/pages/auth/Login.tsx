import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Header } from '@/components/Header';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Login component mounted');
    
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Current session:', session);
        if (session) {
          await handleAuthChange(session);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        toast.error('Error checking authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event);
      console.log('Session data:', session);
      
      if (_event === 'SIGNED_IN' && session) {
        console.log('User signed in successfully');
        await handleAuthChange(session);
      } else if (_event === 'SIGNED_OUT') {
        console.log('User signed out');
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuthChange = async (session: any) => {
    if (!session) return;

    try {
      console.log('Fetching user profile for:', session.user.id);
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error('Error fetching user profile. Please try again.');
        return;
      }

      console.log('User profile:', profile);

      if (profile) {
        if (profile.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else {
          console.log('Redirecting to user dashboard');
          navigate('/dashboard');
        }
        toast.success('Successfully logged in');
      } else {
        console.error('No profile found for user');
        toast.error('User profile not found. Please contact support.');
      }
    } catch (error) {
      console.error('Error in auth change:', error);
      toast.error('Authentication error. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-100 via-background to-secondary flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

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
            providers={['google', 'github']}
            redirectTo={window.location.origin}
            theme="light"
          />
        </Card>
      </div>
    </div>
  );
}