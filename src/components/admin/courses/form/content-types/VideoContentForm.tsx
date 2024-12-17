import { VideoUploadForm } from "./VideoUploadForm";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContentFormProps } from "./types";
import { Card } from "@/components/ui/card";

export function VideoContentForm({ onChange, value }: ContentFormProps) {
  console.log('Current video content value:', value);

  const handleVideoUpload = (videoUrl: string) => {
    console.log('Video uploaded, URL:', videoUrl);
    onChange({ ...value, videoUrl });
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <VideoUploadForm onUploadComplete={handleVideoUpload} />
      </Card>
      
      <div>
        <Label>Transcript</Label>
        <Textarea
          placeholder="Add video transcript (optional)"
          value={value?.transcript || ""}
          onChange={(e) => onChange({ ...value, transcript: e.target.value })}
          className="min-h-[100px]"
        />
      </div>

      {value?.videoUrl && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <video 
            src={value.videoUrl} 
            controls 
            className="w-full rounded-lg"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}