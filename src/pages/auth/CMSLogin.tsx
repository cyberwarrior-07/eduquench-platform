import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingState } from "@/components/auth/LoadingState";

const CMSLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log("CMS Login component mounted");
    
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

      if (profile?.role === 'admin') {
        console.log("Redirecting to admin dashboard");
        navigate('/admin');
      } else {
        console.log("Unauthorized access, redirecting to login");
        toast.error("Unauthorized access. Please use the student login page.");
        await supabase.auth.signOut();
        navigate('/login');
      }
    } catch (error) {
      console.error("Error handling user session:", error);
      toast.error("Error fetching user role. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
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
      setIsSubmitting(false);
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
              CMS Login
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to access the admin dashboard
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>For student access, please use the <a href="/login" className="text-primary hover:underline">student login page</a></p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSLogin;