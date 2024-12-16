import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/auth/LoadingState";
import { authStyles } from "@/components/auth/AuthStyles";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  const handleDirectLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      if (data.session) {
        await handleUserSession(data.session);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const directLogin = async () => {
      const email = searchParams.get('email');
      const password = searchParams.get('password');
      
      if (email && password) {
        await handleDirectLogin(email, password);
      }
    };

    directLogin();
  }, [searchParams]);

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
          <div className="space-y-4">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                style: {
                  button: {
                    background: 'rgb(var(--primary))',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '6px',
                    width: '100%',
                    marginTop: '10px',
                  },
                  input: {
                    borderRadius: '6px',
                    padding: '10px',
                    border: '1px solid rgb(var(--border))',
                  },
                  message: {
                    color: 'rgb(var(--foreground))',
                    marginBottom: '10px',
                  }
                }
              }}
              theme="light"
              providers={[]}
              redirectTo={window.location.origin}
            />
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Direct Login URLs:</p>
              <div className="mt-2 space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    const adminUrl = `${baseUrl}/login?email=admin@eduquench.com&password=admin123`;
                    navigator.clipboard.writeText(adminUrl);
                    toast.success('Admin login URL copied to clipboard');
                  }}
                >
                  Copy Admin Login URL
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const baseUrl = window.location.origin;
                    const studentUrl = `${baseUrl}/login?email=student@eduquench.com&password=student123`;
                    navigator.clipboard.writeText(studentUrl);
                    toast.success('Student login URL copied to clipboard');
                  }}
                >
                  Copy Student Login URL
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;