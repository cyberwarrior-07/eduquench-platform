import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseContentList } from "@/components/admin/CourseContentList";
import { LiveSessionList } from "@/components/admin/LiveSessionList";
import { CourseBasicInfo } from "@/components/admin/courses/form/CourseBasicInfo";
import { ContentBuilder } from "@/components/admin/courses/form/ContentBuilder";

interface CourseFormData {
  title: string;
  description: string;
  price: string;
  currency: string;
  is_published: boolean;
  thumbnail_url?: string;
}

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price: "",
    currency: "INR",
    is_published: false,
    thumbnail_url: "",
  });

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing,
    meta: {
      onSuccess: (data: any) => {
        if (data) {
          setFormData({
            title: data.title,
            description: data.description || "",
            price: data.price?.toString() || "",
            currency: data.currency || "INR",
            is_published: data.is_published || false,
            thumbnail_url: data.thumbnail_url || "",
          });
        }
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update({
            ...data,
            price: data.price ? parseFloat(data.price) : null,
          })
          .eq('id', id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            ...data,
            price: data.price ? parseFloat(data.price) : null,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success(`Course ${isEditing ? 'updated' : 'created'} successfully`);
      navigate('/admin/courses');
    },
    onError: (error) => {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} course`);
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          {isEditing ? "Edit Course" : "New Course"}
        </h1>
        <p className="text-muted-foreground">
          {isEditing
            ? "Update your course details and manage content"
            : "Create a new course"}
        </p>
      </div>

      {isEditing ? (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="live-sessions">Live Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <form onSubmit={handleSubmit} className="space-y-6">
              <CourseBasicInfo
                formData={formData}
                setFormData={setFormData}
                isEditing={isEditing}
              />
              <div className="flex gap-4">
                <Button type="submit">Save Course</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/courses')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="content">
            <CourseContentList courseId={id} />
          </TabsContent>

          <TabsContent value="live-sessions">
            <LiveSessionList courseId={id} />
          </TabsContent>
        </Tabs>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <CourseBasicInfo
            formData={formData}
            setFormData={setFormData}
            isEditing={isEditing}
          />
          <ContentBuilder />
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
      )}
    </div>
  );
}