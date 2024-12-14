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
  videoUrl?: string;
  requirements: string[];
  objectives: string[];
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  enrollmentStatus: 'Open' | 'Closed' | 'In Progress';
  syllabus?: {
    week: number;
    topic: string;
    content: string;
  }[];
}