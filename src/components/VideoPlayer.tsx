import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Volume2, Maximize2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  instructor?: string;
}

export const VideoPlayer = ({ videoUrl, title, instructor }: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
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
        </div>
        <div className="space-y-2">
          <div className="h-1 w-full bg-gray-200 rounded">
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
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-primary">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};