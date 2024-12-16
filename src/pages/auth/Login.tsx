import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/auth/LoadingState";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Login component mounted");
    
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Session found, handling user session");
          await handleUserSession(session);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        toast.error("Error checking session. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (session) {
        console.log("New session detected, handling user session");
        await handleUserSession(session);
      }
    });

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleUserSession = async (session: any) => {
    try {
      console.log("Fetching user profile...");
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }

      console.log("User profile:", profile);

      if (profile?.role === 'student') {
        console.log("Redirecting to student dashboard");
        navigate('/dashboard');
      } else {
        console.log("Unauthorized access, redirecting to CMS login");
        toast.error("Please use the CMS login page for admin access.");
        await supabase.auth.signOut();
        navigate('/cms');
      }
    } catch (error) {
      console.error("Error handling user session:", error);
      toast.error("Error fetching user role. Please try again.");
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md border-2 border-primary-800 shadow-lg">
        <CardHeader className="space-y-4 pb-8 border-b border-primary-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-100">
            <LogIn className="h-7 w-7 text-primary-800" />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Student Login
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to access your learning dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <div className="space-y-4">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    background: '#FF4500',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '6px',
                    width: '100%',
                    marginTop: '10px',
                    border: '1px solid #FF916E'
                  },
                  input: {
                    borderRadius: '6px',
                    padding: '10px',
                    border: '1px solid #FF916E',
                    backgroundColor: 'transparent'
                  },
                  message: {
                    color: 'rgb(var(--foreground))',
                    marginBottom: '10px',
                    border: '1px solid #FF916E',
                    borderRadius: '6px',
                    padding: '10px'
                  }
                }
              }}
              theme="light"
              providers={[]}
              redirectTo={window.location.origin}
            />
            <div className="mt-4 text-center text-sm text-gray-500 border-t border-primary-200 pt-4">
              <p>For admin access, please use the <a href="/cms" className="text-primary-800 hover:text-primary-900 hover:underline">CMS login page</a></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;