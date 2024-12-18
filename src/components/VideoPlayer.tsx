import React from 'react';
import { Card } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { VideoControls } from './video-player/VideoControls';
import { TranscriptDisplay } from './video-player/TranscriptDisplay';
import { LanguageSelector } from './video-player/LanguageSelector';
import { VideoProgress } from './video-player/VideoProgress';
import { VideoOverlay } from './video-player/VideoOverlay';

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
      const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-video', {
        body: { videoUrl, targetLanguage: selectedLanguage }
      });

      if (transcriptionError) throw transcriptionError;

      const transcriptionArray = Array.isArray(transcriptionData.transcription)
        ? transcriptionData.transcription
        : JSON.parse(transcriptionData.transcription as string);

      setTranscript(transcriptionArray);
      toast.success('Transcription completed');
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error('Failed to transcribe video');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleLanguageChange = async (value: string) => {
    setSelectedLanguage(value);
    if (videoUrl) {
      await handleTranscribe();
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
        
        <VideoOverlay instructor={instructor}>
          <VideoProgress progress={progress} />
          
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
        </VideoOverlay>
      </div>
      
      <TranscriptDisplay
        transcript={transcript}
        currentTime={videoRef.current?.currentTime || 0}
        onSegmentClick={handleSegmentClick}
      />
    </Card>
  );
};