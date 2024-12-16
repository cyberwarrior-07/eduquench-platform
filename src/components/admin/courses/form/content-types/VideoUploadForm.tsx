import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface VideoUploadFormProps {
  onUploadComplete: (videoUrl: string) => void;
}

export function VideoUploadForm({ onUploadComplete }: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is video
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('course-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-videos')
        .getPublicUrl(filePath);

      onUploadComplete(publicUrl);
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Error uploading video:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Video File</Label>
        <div className="mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isUploading}
            onClick={() => document.getElementById('video-upload')?.click()}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
          <Input
            id="video-upload"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
        </div>
      </div>
    </div>
  );
}