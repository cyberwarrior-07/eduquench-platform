import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

interface QuizEditorProps {
  quizId: string;
  onSave: () => void;
}

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
      const { error } = await supabase.from("quiz_questions").insert(
        questions.map((q) => ({
          quiz_id: quizId,
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
      onSave();
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
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="topic">Topic for AI Generation</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic for quiz generation"
          />
        </div>
        <Button onClick={handleGenerateQuestions} disabled={isGenerating}>
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Questions
        </Button>
      </div>

      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="border p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <Label>Question {qIndex + 1}</Label>
                <Textarea
                  value={question.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, "question", e.target.value)
                  }
                  placeholder="Enter question"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuestion(qIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {question.options.map((option, oIndex) => (
                <Input
                  key={oIndex}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  placeholder={`Option ${oIndex + 1}`}
                  className="mb-2"
                />
              ))}
            </div>

            <div>
              <Label>Correct Answer</Label>
              <Input
                value={question.correct_answer}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "correct_answer", e.target.value)
                }
                placeholder="Enter correct answer"
              />
            </div>

            <div>
              <Label>Explanation (Optional)</Label>
              <Textarea
                value={question.explanation}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "explanation", e.target.value)
                }
                placeholder="Enter explanation for the correct answer"
              />
            </div>
          </div>
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