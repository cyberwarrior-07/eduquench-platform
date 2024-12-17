import React from 'react';
import { Button } from '../ui/button';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Languages } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onMuteToggle: () => void;
  onFullscreen: () => void;
  onTranscribe: () => void;
  isTranscribing: boolean;
}

export const VideoControls = ({
  isPlaying,
  isMuted,
  onPlayPause,
  onRestart,
  onMuteToggle,
  onFullscreen,
  onTranscribe,
  isTranscribing
}: VideoControlsProps) => {
  return (
    <div className="flex justify-between items-center text-white">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className="hover:bg-white/10 text-white"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRestart}
          className="hover:bg-white/10 text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onMuteToggle}
          className="hover:bg-white/10 text-white"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTranscribe}
          disabled={isTranscribing}
          className="hover:bg-white/10 text-white"
        >
          <Languages className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onFullscreen}
          className="hover:bg-white/10 text-white"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};