import React, { useRef, useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Play, Pause, RotateCcw, Volume2, Maximize2, Subtitles } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoPlayerWithTranscriptProps {
  videoUrl: string;
  title: string;
  instructor?: string;
}

export const VideoPlayerWithTranscript = ({ videoUrl, title, instructor }: VideoPlayerWithTranscriptProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const handleTranscribe = async () => {
    setIsTranscribing(true);
    // Here you would integrate with Google Speech-to-Text API
    // This is a mock implementation
    try {
      console.log('Starting transcription...');
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setTranscript('This is a sample transcript of the video content...');
    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    // Here you would translate the transcript to the selected language
    console.log('Changing language to:', value);
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
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleTranscribe}
              disabled={isTranscribing}
            >
              <Subtitles className="h-4 w-4" />
            </Button>
          </div>
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
        {transcript && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Transcript</h4>
            <p className="text-sm text-gray-600">{transcript}</p>
          </div>
        )}
      </div>
    </Card>
  );
};