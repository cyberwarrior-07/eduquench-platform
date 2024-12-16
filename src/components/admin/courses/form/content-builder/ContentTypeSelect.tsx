import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ContentType } from "../../course-content/AddContentForm";

interface ContentTypeSelectProps {
  value: ContentType;
  onChange: (value: ContentType) => void;
}

export function ContentTypeSelect({ value, onChange }: ContentTypeSelectProps) {
  return (
    <div>
      <Label>Content Type</Label>
      <Select value={value} onValueChange={onChange}>
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
  );
}