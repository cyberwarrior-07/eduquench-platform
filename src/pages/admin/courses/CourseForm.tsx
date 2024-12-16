import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CourseBasicInfo } from "@/components/admin/courses/form/CourseBasicInfo";
import { ContentBuilder } from "@/components/admin/courses/form/ContentBuilder";
import { Card } from "@/components/ui/card";

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
      const { error } = await supabase
        .from('courses')
        .insert({
          ...data,
          price: data.price ? parseFloat(data.price) : null,
          status: 'draft'
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success('Course created successfully');
      navigate('/admin/courses');
    },
    onError: (error) => {
      toast.error('Failed to create course');
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">New Course</h1>
        <p className="text-muted-foreground">
          Create a new course and add content
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <CourseBasicInfo
            formData={formData}
            setFormData={setFormData}
            isEditing={false}
          />
        </Card>

        <Card className="p-6">
          <ContentBuilder />
        </Card>

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