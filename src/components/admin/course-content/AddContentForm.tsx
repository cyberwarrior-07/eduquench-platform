import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { VideoContentForm } from "../courses/form/content-types/VideoContentForm";
import { QuizContentForm } from "../courses/form/content-types/QuizContentForm";
import { ChapterContentForm } from "../courses/form/content-types/ChapterContentForm";
import { LessonContentForm } from "../courses/form/content-types/LessonContentForm";
import { Json } from "@/integrations/supabase/types";

export type ContentType = "video" | "quiz" | "chapter" | "lesson";

interface FormData {
  title: string;
  description: string;
  type: ContentType;
  content: Json;
}

interface AddContentFormProps {
  onSubmit: (data: FormData) => void;
}

export function AddContentForm({ onSubmit }: AddContentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "video",
    content: {},
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleContentChange = (content: any) => {
    setFormData({ ...formData, content });
  };

  const renderContentForm = () => {
    switch (formData.type) {
      case "video":
        return (
          <VideoContentForm
            value={formData.content}
            onChange={handleContentChange}
          />
        );
      case "quiz":
        return (
          <QuizContentForm
            value={formData.content}
            onChange={handleContentChange}
          />
        );
      case "chapter":
        return (
          <ChapterContentForm
            value={formData.content}
            onChange={handleContentChange}
          />
        );
      case "lesson":
        return (
          <LessonContentForm
            value={formData.content}
            onChange={handleContentChange}
          />
        );
      default:
        return null;
    }
  };

  return (
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
            setFormData({ ...formData, type: value, content: {} })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="quiz">Quiz</SelectItem>
            <SelectItem value="chapter">Chapter</SelectItem>
            <SelectItem value="lesson">Lesson</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {renderContentForm()}

      <Button type="submit">Add Content</Button>
    </form>
  );
}