import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionForm } from "./QuestionForm";
import { TopicGenerator } from "./TopicGenerator";
import { QuizQuestion, QuizEditorProps } from "./types";

export function QuizEditor({ quizId, onSave }: QuizEditorProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const { toast } = useToast();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
      },
    ]);
  };

  const handleQuestionChange = (index: number, field: keyof QuizQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleGenerateQuestions = async () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic for quiz generation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error("Failed to generate questions");

      const data = await response.json();
      setQuestions(data.questions);
      toast({
        title: "Success",
        description: "Quiz questions generated successfully",
      });
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz questions",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    try {
      const newQuizId = quizId || crypto.randomUUID();
      
      const { error } = await supabase.from("quiz_questions").insert(
        questions.map((q) => ({
          quiz_id: newQuizId,
          question: q.question,
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation,
        }))
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Quiz saved successfully",
      });
      
      onSave(newQuizId);
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast({
        title: "Error",
        description: "Failed to save quiz",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <TopicGenerator
        topic={topic}
        isGenerating={isGenerating}
        onTopicChange={setTopic}
        onGenerate={handleGenerateQuestions}
      />

      <div className="space-y-6">
        {questions.map((question, index) => (
          <QuestionForm
            key={index}
            question={question}
            index={index}
            onQuestionChange={handleQuestionChange}
            onOptionChange={handleOptionChange}
            onRemove={handleRemoveQuestion}
          />
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleAddQuestion} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Question
        </Button>
        <Button onClick={handleSave} disabled={questions.length === 0}>
          Save Quiz
        </Button>
      </div>
    </div>
  );
}