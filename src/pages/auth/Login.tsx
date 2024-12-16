import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/auth/LoadingState";
import { authStyles } from "@/components/auth/AuthStyles";

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

      if (profile) {
        switch (profile.role) {
          case 'admin':
            console.log("Redirecting to admin dashboard");
            navigate('/admin');
            break;
          case 'student':
          default:
            console.log("Redirecting to student dashboard");
            navigate('/dashboard');
            break;
        }
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
      <Card className="w-full max-w-md border-2 shadow-lg">
        <CardHeader className="space-y-4 pb-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-7 w-7 text-primary" />
          </div>
          <div className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome to EduQuench
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to access your learning dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              ...authStyles
            }}
            theme="light"
            providers={[]}
            redirectTo={window.location.origin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;