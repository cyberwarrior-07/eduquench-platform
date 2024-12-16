import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
          case 'mentor':
            console.log("Redirecting to mentor dashboard");
            navigate('/mentor');
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <LogIn className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold text-center">
            Welcome to EduQuench
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access your learning dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: '0.375rem',
                  height: '2.5rem',
                  '&:hover': {
                    background: 'var(--primary-600)',
                  },
                },
                anchor: {
                  color: 'var(--primary)',
                  fontWeight: '500',
                },
                container: {
                  width: '100%',
                },
                divider: {
                  background: 'hsl(var(--border))',
                  margin: '1rem 0',
                },
                input: {
                  borderRadius: '0.375rem',
                  padding: '0.625rem 0.875rem',
                  backgroundColor: 'transparent',
                  border: '1px solid hsl(var(--border))',
                },
                message: {
                  borderRadius: '0.375rem',
                  padding: '0.625rem 0.875rem',
                  marginBottom: '0.75rem',
                },
                label: {
                  color: 'hsl(var(--foreground))',
                  marginBottom: '0.375rem',
                },
              },
              variables: {
                default: {
                  colors: {
                    brand: 'var(--primary)',
                    brandAccent: 'var(--primary-600)',
                  },
                },
              },
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