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
import { QuizEditor } from "./quiz/QuizEditor";
import { Json } from "@/integrations/supabase/types";

export type ContentType = "video" | "quiz" | "assignment" | "live";

interface FormData {
  title: string;
  description: string;
  type: ContentType;
  content: Json;
  quizId?: string; // Added this to handle quiz editing
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

  const handleQuizSave = (quizId: string) => {
    setFormData({ ...formData, quizId });
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
            <SelectItem value="live">Live Session</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "quiz" && (
        <QuizEditor
          quizId={formData.quizId}
          onSave={handleQuizSave}
        />
      )}

      <Button type="submit">Add Content</Button>
    </form>
  );
}