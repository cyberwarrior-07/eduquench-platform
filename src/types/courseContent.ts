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

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'chapter' | 'lesson';
  duration: string;
  lessons: Module[];
}