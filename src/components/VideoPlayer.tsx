import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Volume2, Maximize2, VolumeX, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  instructor?: string;
}

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

export const VideoPlayer = ({ videoUrl, title, instructor }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [transcript, setTranscript] = React.useState<TranscriptSegment[]>([]);
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
      
      // Update active transcript segment
      const currentTime = videoRef.current.currentTime;
      const activeSegment = transcript.find(
        seg => currentTime >= seg.start && currentTime <= seg.end
      );
      if (activeSegment) {
        // Update UI to highlight current segment
        console.log('Current segment:', activeSegment.text);
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setProgress(0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleTranscribe = async () => {
    if (!videoUrl) {
      toast.error('No video URL provided');
      return;
    }

    setIsTranscribing(true);
    try {
      const { data, error } = await supabase.functions.invoke('transcribe-translate', {
        body: { videoUrl, targetLanguage: selectedLanguage }
      });

      if (error) throw error;

      setTranscript(data.timestamps);
      toast.success('Transcription completed');
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe video');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    if (transcript.length > 0) {
      handleTranscribe(); // Re-transcribe with new language
    }
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <Card className="w-full bg-white shadow-sm">
      <div className="relative aspect-video bg-gray-100">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
        />
        {instructor && (
          <div className="absolute top-4 right-4 bg-white rounded-lg p-2 shadow-md">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${instructor}`}
              alt={instructor}
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}
      </div>
      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-2">
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleTranscribe}
              disabled={isTranscribing}
            >
              <Languages className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div 
            className="h-1 w-full bg-gray-200 rounded cursor-pointer"
            onClick={(e) => {
              if (videoRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percentage = (x / rect.width) * 100;
                videoRef.current.currentTime = (percentage / 100) * videoRef.current.duration;
                setProgress(percentage);
              }
            }}
          >
            <div
              className="h-full bg-primary rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="hover:text-primary"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRestart}
                className="hover:text-primary"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
                className="hover:text-primary"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleFullscreen}
              className="hover:text-primary"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {transcript.length > 0 && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Transcript</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {transcript.map((segment, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-2 rounded transition-colors",
                    videoRef.current &&
                    videoRef.current.currentTime >= segment.start &&
                    videoRef.current.currentTime <= segment.end
                      ? "bg-primary/10"
                      : "hover:bg-muted"
                  )}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = segment.start;
                    }
                  }}
                >
                  {segment.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};