import React from 'react';

interface VideoOverlayProps {
  instructor?: string;
  children: React.ReactNode;
}

export const VideoOverlay = ({ instructor, children }: VideoOverlayProps) => {
  return (
    <>
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
          {children}
        </div>
      </div>
    </>
  );
};