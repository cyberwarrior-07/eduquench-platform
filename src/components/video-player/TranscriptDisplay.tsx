import React from 'react';
import { cn } from '@/lib/utils';

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface TranscriptDisplayProps {
  transcript: TranscriptSegment[];
  currentTime: number;
  onSegmentClick: (start: number) => void;
}

export const TranscriptDisplay = ({ transcript, currentTime, onSegmentClick }: TranscriptDisplayProps) => {
  if (transcript.length === 0) return null;

  return (
    <div className="p-4 space-y-2">
      <h4 className="font-medium text-gray-900">Transcript</h4>
      <div className="max-h-60 overflow-y-auto space-y-2">
        {transcript.map((segment, index) => (
          <div
            key={index}
            className={cn(
              "p-2 rounded-lg transition-colors cursor-pointer",
              currentTime >= segment.start && currentTime <= segment.end
                ? "bg-primary/10"
                : "hover:bg-gray-100"
            )}
            onClick={() => onSegmentClick(segment.start)}
          >
            <p className="text-sm text-gray-600">{segment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};