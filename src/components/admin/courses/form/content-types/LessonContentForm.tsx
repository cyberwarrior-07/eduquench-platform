import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface LessonContentFormProps {
  onChange: (data: any) => void;
  value: any;
}

export function LessonContentForm({ onChange, value }: LessonContentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Content</Label>
        <Textarea
          placeholder="Enter lesson content or instructions"
          value={value?.content || ""}
          onChange={(e) => onChange({ ...value, content: e.target.value })}
        />
      </div>
      <div>
        <Label>Resources</Label>
        <Textarea
          placeholder="Add any additional resources or links"
          value={value?.resources || ""}
          onChange={(e) => onChange({ ...value, resources: e.target.value })}
        />
      </div>
      <div>
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          min="1"
          placeholder="Enter estimated duration"
          value={value?.duration || ""}
          onChange={(e) => onChange({ ...value, duration: e.target.value })}
        />
      </div>
    </div>
  );
}