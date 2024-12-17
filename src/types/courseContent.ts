export interface VideoContent {
  videoUrl: string;
  description?: string;
}

export interface QuizContent {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export interface ChapterContent {
  description: string;
}

export interface CourseContent {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  type: 'video' | 'quiz' | 'chapter' | 'lesson';
  content: VideoContent | QuizContent | ChapterContent;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading';
  isCompleted?: boolean;
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}