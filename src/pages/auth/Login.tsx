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
        <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground font-medium">Loading...</span>
        </div>
      </div>
    );
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
              style: {
                button: {
                  background: '#FF4500',
                  color: 'white',
                  borderRadius: '0.5rem',
                  height: '2.75rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    background: '#CC3700',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: '0 0 0 2px rgba(255, 69, 0, 0.2)',
                  }
                },
                anchor: {
                  color: '#FF4500',
                  fontWeight: '500',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                },
                container: {
                  width: '100%'
                },
                divider: {
                  background: 'hsl(var(--border))',
                  margin: '1.5rem 0'
                },
                input: {
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'white',
                  border: '1px solid hsl(var(--border))',
                  fontSize: '1rem',
                  width: '100%',
                  '&:focus': {
                    outline: 'none',
                    borderColor: '#FF4500',
                    boxShadow: '0 0 0 2px rgba(255, 69, 0, 0.1)',
                  }
                },
                message: {
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  fontSize: '0.925rem',
                  backgroundColor: 'rgba(255, 69, 0, 0.1)',
                  color: '#FF4500'
                },
                label: {
                  color: 'hsl(var(--foreground))',
                  marginBottom: '0.5rem',
                  fontSize: '0.925rem',
                  fontWeight: '500',
                  display: 'block'
                }
              },
              variables: {
                default: {
                  colors: {
                    brand: '#FF4500',
                    brandAccent: '#CC3700',
                    inputBackground: 'white',
                    inputBorder: 'hsl(var(--border))',
                    inputBorderFocus: '#FF4500',
                    inputBorderHover: '#FF4500',
                  }
                }
              }
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