export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  lessons: number;
  progress?: number;
  isLocked: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  transcript: string;
  duration: string;
  isLocked: boolean;
}