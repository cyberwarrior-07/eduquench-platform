import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ContentType } from "./AddContentForm";
import { Json } from "@/integrations/supabase/types";

interface FormData {
  title: string;
  description: string;
  type: ContentType;
  content: Json;
}

export function useContentManagement(courseId: string) {
  const queryClient = useQueryClient();

  const { data: contents, isLoading } = useQuery({
    queryKey: ['course-contents', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { error } = await supabase
        .from('course_content')
        .insert({
          course_id: courseId,
          title: data.title,
          description: data.description,
          type: data.type,
          content: data.content,
          order_index: contents?.length || 0,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-contents'] });
      toast.success("Content added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add content");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('course_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-contents'] });
      toast.success("Content deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete content");
      console.error(error);
    },
  });

  return {
    contents,
    isLoading,
    createContent: createMutation.mutate,
    deleteContent: deleteMutation.mutate,
  };
}