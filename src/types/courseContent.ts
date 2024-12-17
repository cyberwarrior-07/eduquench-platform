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
  title: string;
  type: 'video' | 'quiz' | 'chapter' | 'lesson';
  content: VideoContent | QuizContent | ChapterContent;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  type: 'video' | 'quiz' | 'chapter' | 'lesson';
  duration?: number;
  lessons?: Module[];
}