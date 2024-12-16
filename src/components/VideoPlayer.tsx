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
import { Progress } from './ui/progress';

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
      // First, get the transcription
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-video', {
        body: { videoUrl }
      });

      if (transcriptionError) throw transcriptionError;

      // Then, translate if needed
      if (selectedLanguage !== 'en') {
        const { data: translationData, error: translationError } = await supabase.functions.invoke('translate-text', {
          body: { 
            text: transcriptionData.transcription.map((t: any) => t.text).join('\n'),
            targetLanguage: selectedLanguage 
          }
        });

        if (translationError) throw translationError;

        // Combine timing data with translated text
        const translatedTranscript = transcriptionData.transcription.map((segment: any, index: number) => ({
          ...segment,
          text: translationData.translations[index]
        }));

        setTranscript(translatedTranscript);
      } else {
        setTranscript(transcriptionData.transcription);
      }

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
    <Card className="w-full bg-white shadow-sm overflow-hidden">
      <div className="relative aspect-video bg-gray-900">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
        />
        {instructor && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-md">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${instructor}`}
              alt={instructor}
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="space-y-4">
            <Progress 
              value={progress} 
              className="h-1 bg-white/20" 
              indicatorClassName="bg-primary"
            />
            
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePlay}
                  className="hover:bg-white/10 text-white"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRestart}
                  className="hover:bg-white/10 text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMute}
                  className="hover:bg-white/10 text-white"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
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
                  variant="ghost"
                  size="icon"
                  onClick={handleTranscribe}
                  disabled={isTranscribing}
                  className="hover:bg-white/10 text-white"
                >
                  <Languages className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleFullscreen}
                  className="hover:bg-white/10 text-white"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {transcript.length > 0 && (
        <div className="p-4 space-y-2">
          <h4 className="font-medium text-gray-900">Transcript</h4>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {transcript.map((segment, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 rounded-lg transition-colors cursor-pointer",
                  videoRef.current &&
                  videoRef.current.currentTime >= segment.start &&
                  videoRef.current.currentTime <= segment.end
                    ? "bg-primary/10"
                    : "hover:bg-gray-100"
                )}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = segment.start;
                  }
                }}
              >
                <p className="text-sm text-gray-600">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
