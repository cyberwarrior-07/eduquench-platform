export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  lessons: number;
  level: string;
  enrollmentStatus: string;
  progress?: number;
  isLocked: boolean;
  objectives: string[];
  requirements: string[];
  instructor: string;
  category: string;
}