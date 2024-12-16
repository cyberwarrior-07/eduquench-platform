import { Json } from "@/integrations/supabase/types";

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

export interface QuizEditorProps {
  quizId?: string;
  onSave: (quizId: string) => void;
}