import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { QuizQuestion } from "./types";

interface QuestionFormProps {
  question: QuizQuestion;
  index: number;
  onQuestionChange: (index: number, field: keyof QuizQuestion, value: any) => void;
  onOptionChange: (questionIndex: number, optionIndex: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function QuestionForm({
  question,
  index,
  onQuestionChange,
  onOptionChange,
  onRemove,
}: QuestionFormProps) {
  return (
    <div className="border p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-2">
          <Label>Question {index + 1}</Label>
          <Textarea
            value={question.question}
            onChange={(e) => onQuestionChange(index, "question", e.target.value)}
            placeholder="Enter question"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
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
            onChange={(e) => onOptionChange(index, oIndex, e.target.value)}
            placeholder={`Option ${oIndex + 1}`}
            className="mb-2"
          />
        ))}
      </div>

      <div>
        <Label>Correct Answer</Label>
        <Input
          value={question.correct_answer}
          onChange={(e) => onQuestionChange(index, "correct_answer", e.target.value)}
          placeholder="Enter correct answer"
        />
      </div>

      <div>
        <Label>Explanation (Optional)</Label>
        <Textarea
          value={question.explanation}
          onChange={(e) => onQuestionChange(index, "explanation", e.target.value)}
          placeholder="Enter explanation for the correct answer"
        />
      </div>
    </div>
  );
}