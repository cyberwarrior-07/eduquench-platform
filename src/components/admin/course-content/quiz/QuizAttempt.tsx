import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation?: string;
}

interface QuizAttemptProps {
  quizId: string;
  questions: QuizQuestion[];
  onComplete: () => void;
}

export function QuizAttempt({ quizId, questions, onComplete }: QuizAttemptProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions",
        variant: "destructive",
      });
      return;
    }

    const score = questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correct_answer ? 1 : 0);
    }, 0);

    try {
      const { error } = await supabase.from("quiz_attempts").insert({
        quiz_id: quizId,
        answers,
        score,
        completed_at: new Date().toISOString(),
      });

      if (error) throw error;

      setShowResults(true);
      toast({
        title: "Success",
        description: `Quiz completed! Score: ${score}/${questions.length}`,
      });
      onComplete();
    } catch (error) {
      console.error("Error saving quiz attempt:", error);
      toast({
        title: "Error",
        description: "Failed to save quiz attempt",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {questions.map((question, index) => (
        <div key={question.id} className="space-y-4">
          <div className="font-medium">
            Question {index + 1}: {question.question}
          </div>

          <RadioGroup
            value={answers[question.id]}
            onValueChange={(value) =>
              setAnswers({ ...answers, [question.id]: value })
            }
          >
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                <Label htmlFor={`q${index}-o${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>

          {showResults && (
            <div className="mt-2">
              <div
                className={`text-sm ${
                  answers[question.id] === question.correct_answer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {answers[question.id] === question.correct_answer
                  ? "Correct!"
                  : `Incorrect. The correct answer is: ${question.correct_answer}`}
              </div>
              {question.explanation && (
                <div className="text-sm text-gray-600 mt-1">
                  Explanation: {question.explanation}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {!showResults && (
        <Button onClick={handleSubmit} className="w-full">
          Submit Quiz
        </Button>
      )}
    </div>
  );
}