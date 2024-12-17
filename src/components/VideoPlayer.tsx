import React from 'react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VideoControls } from './video-player/VideoControls';
import { TranscriptDisplay } from './video-player/TranscriptDisplay';
import { LanguageSelector } from './video-player/LanguageSelector';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  instructor?: string;
}

export const VideoPlayer = ({ videoUrl, title, instructor }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [transcript, setTranscript] = React.useState<any[]>([]);
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
      console.log('Starting transcription for:', videoUrl);
      
      // First check if we already have a transcription
      const { data: existingTranscription } = await supabase
        .from('video_transcriptions')
        .select('transcription')
        .eq('video_url', videoUrl)
        .eq('language', selectedLanguage)
        .single();

      if (existingTranscription) {
        console.log('Found existing transcription');
        setTranscript(existingTranscription.transcription);
        toast.success('Transcription loaded');
        return;
      }

      // If not, request new transcription
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-video', {
        body: { videoUrl, targetLanguage: selectedLanguage }
      });

      if (transcriptionError) throw transcriptionError;

      // Store the transcription
      const { error: insertError } = await supabase
        .from('video_transcriptions')
        .insert({
          video_url: videoUrl,
          language: selectedLanguage,
          transcription: transcriptionData.transcription
        });

      if (insertError) throw insertError;

      setTranscript(transcriptionData.transcription);
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
      handleTranscribe();
    }
  };

  const handleSegmentClick = (startTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = startTime;
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
              className="h-1 bg-white/20 [&>[role=progressbar]]:bg-primary" 
            />
            
            <div className="flex items-center justify-between gap-4">
              <VideoControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                onPlayPause={togglePlay}
                onRestart={handleRestart}
                onMuteToggle={toggleMute}
                onFullscreen={handleFullscreen}
                onTranscribe={handleTranscribe}
                isTranscribing={isTranscribing}
              />
              <LanguageSelector
                value={selectedLanguage}
                onChange={handleLanguageChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <TranscriptDisplay
        transcript={transcript}
        currentTime={videoRef.current?.currentTime || 0}
        onSegmentClick={handleSegmentClick}
      />
    </Card>
  );
};