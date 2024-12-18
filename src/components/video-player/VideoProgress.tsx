import React from 'react';
import { Progress } from '../ui/progress';

interface VideoProgressProps {
  progress: number;
}

export const VideoProgress = ({ progress }: VideoProgressProps) => {
  return (
    <Progress 
      value={progress} 
      className="h-1 bg-white/20 [&>[role=progressbar]]:bg-primary" 
    />
  );
};