import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ChapterContentFormProps {
  onChange: (data: any) => void;
  value: any;
}

export function ChapterContentForm({ onChange, value }: ChapterContentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Learning Objectives</Label>
        <Textarea
          placeholder="What will students learn in this chapter?"
          value={value?.objectives || ""}
          onChange={(e) => onChange({ ...value, objectives: e.target.value })}
        />
      </div>
      <div>
        <Label>Estimated Duration (hours)</Label>
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