import { VideoUploadForm } from "./VideoUploadForm";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContentFormProps } from "./types";

export function VideoContentForm({ onChange, value }: ContentFormProps) {
  const handleVideoUpload = (videoUrl: string) => {
    onChange({ ...value, videoUrl });
  };

  return (
    <div className="space-y-4">
      <VideoUploadForm onUploadComplete={handleVideoUpload} />
      
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