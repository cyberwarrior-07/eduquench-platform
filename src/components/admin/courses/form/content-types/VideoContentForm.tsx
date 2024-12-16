import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VideoContentFormProps {
  onChange: (data: any) => void;
  value: any;
}

export function VideoContentForm({ onChange, value }: VideoContentFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Video URL</Label>
        <Input
          type="url"
          placeholder="Enter video URL (YouTube, Vimeo, etc.)"
          value={value?.videoUrl || ""}
          onChange={(e) => onChange({ ...value, videoUrl: e.target.value })}
        />
      </div>
      <div>
        <Label>Duration (minutes)</Label>
        <Input
          type="number"
          min="1"
          placeholder="Enter video duration"
          value={value?.duration || ""}
          onChange={(e) => onChange({ ...value, duration: e.target.value })}
        />
      </div>
      <div>
        <Label>Transcript</Label>
        <Textarea
          placeholder="Add video transcript (optional)"
          value={value?.transcript || ""}
          onChange={(e) => onChange({ ...value, transcript: e.target.value })}
        />
      </div>
    </div>
  );
}