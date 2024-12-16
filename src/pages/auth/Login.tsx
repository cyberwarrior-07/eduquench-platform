import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { authStyles } from '@/components/auth/AuthStyles';
import { LoadingState } from '@/components/auth/LoadingState';
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Handle auth state changes and errors
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN') {
        console.log('User signed in successfully');
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
        navigate('/dashboard');
      }

      if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }

      // Handle auth events
      if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
        console.error('Auth event:', event);
        toast({
          variant: "destructive",
          title: "Authentication Status",
          description: `Authentication status: ${event}`,
        });
      }

      setIsLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      if (session) {
        console.log('User already logged in, redirecting...');
        navigate('/dashboard');
      }
      setIsLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: authStyles.style,
          }}
          theme="light"
          providers={[]}
        />
      </Card>
    </div>
  );
};

export default Login;