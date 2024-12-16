import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Video, FileText, GraduationCap, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

interface CourseContentListProps {
  courseId: string;
}

type ContentType = "video" | "quiz" | "assignment" | "live";

interface FormData {
  title: string;
  description: string;
  type: ContentType;
  content: Json;
}

export function CourseContentList({ courseId }: CourseContentListProps) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "video",
    content: {},
  });

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
      setIsOpen(false);
      setFormData({
        title: "",
        description: "",
        type: "video",
        content: {},
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "quiz":
        return <FileText className="h-4 w-4" />;
      case "assignment":
        return <GraduationCap className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Course Content</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Course Content</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: ContentType) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Add Content</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {contents?.map((content, index) => (
          <div
            key={content.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-2 rounded-full">
                {getContentIcon(content.type as ContentType)}
              </div>
              <div>
                <h3 className="font-medium">{content.title}</h3>
                <p className="text-sm text-gray-500">{content.description}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMutation.mutate(content.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}