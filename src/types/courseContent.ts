import { Json } from "@/integrations/supabase/types";

export interface VideoContent {
  videoUrl: string;
  description?: string;
}

export interface CourseContent {
  id: string;
  title: string;
  type: "video" | "quiz" | "chapter" | "lesson";
  content: Json;
  description?: string;
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading';
  isCompleted?: boolean;
}