import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CourseBasicInfo } from "@/components/admin/courses/form/CourseBasicInfo";
import { ContentBuilder } from "@/components/admin/courses/form/ContentBuilder";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CourseFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  is_published: boolean;
  thumbnail_url?: string;
}

export default function CourseForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userRole, setUserRole] = useState<string | null>(null);

  // Check user authentication and role
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return null;
      }
      return session;
    },
  });

  // Fetch user role if authenticated
  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (profile?.role !== 'admin' && profile?.role !== 'mentor') {
          toast.error('Unauthorized: Only admins and mentors can create courses');
          navigate('/dashboard');
          return;
        }
        
        setUserRole(profile?.role);
      }
    };

    fetchUserRole();
  }, [session, navigate]);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: "",
    currency: "INR",
    is_published: false,
    thumbnail_url: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('courses')
        .insert({
          ...data,
          price: data.price ? parseFloat(data.price) : null,
          status: 'draft',
          created_by: session.user.id,
          mentor_id: session.user.id
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created successfully');
      navigate('/admin/courses');
    },
    onError: (error) => {
      console.error('Failed to create course:', error);
      toast.error('Failed to create course. Please make sure you have the correct permissions.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Only render the form if user has appropriate role
  if (!userRole || (userRole !== 'admin' && userRole !== 'mentor')) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Course</h1>
        <p className="text-muted-foreground">
          Create a new course and add content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList>
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="content">Course Content</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card className="p-6">
              <CourseBasicInfo
                formData={formData}
                setFormData={setFormData}
                isEditing={false}
              />
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="p-6">
              <ContentBuilder />
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button type="submit">Create Course</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/courses')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}