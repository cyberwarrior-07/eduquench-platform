import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface QuizContentFormProps {
  onChange: (data: any) => void;
  value: any;
}

export function QuizContentForm({ onChange, value }: QuizContentFormProps) {
  const [questions, setQuestions] = useState(value?.questions || []);

  const addQuestion = () => {
    const newQuestions = [
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      },
    ];
    setQuestions(newQuestions);
    onChange({ ...value, questions: newQuestions });
  };

  const updateQuestion = (index: number, field: string, newValue: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: newValue };
    setQuestions(newQuestions);
    onChange({ ...value, questions: newQuestions });
  };

  const removeQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
    onChange({ ...value, questions: newQuestions });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Time Limit (minutes)</Label>
        <Input
          type="number"
          min="1"
          placeholder="Enter time limit"
          value={value?.timeLimit || ""}
          onChange={(e) => onChange({ ...value, timeLimit: e.target.value })}
        />
      </div>

      <div className="space-y-6">
        {questions.map((question: any, index: number) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <Label>Question {index + 1}</Label>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeQuestion(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <Textarea
              placeholder="Enter question"
              value={question.question}
              onChange={(e) =>
                updateQuestion(index, "question", e.target.value)
              }
            />

            <div className="space-y-2">
              <Label>Options</Label>
              {question.options.map((option: string, optionIndex: number) => (
                <div key={optionIndex} className="flex gap-2">
                  <Input
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[optionIndex] = e.target.value;
                      updateQuestion(index, "options", newOptions);
                    }}
                  />
                  <Button
                    type="button"
                    variant={question.correctAnswer === optionIndex ? "default" : "outline"}
                    onClick={() => updateQuestion(index, "correctAnswer", optionIndex)}
                  >
                    Correct
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Label>Explanation</Label>
              <Textarea
                placeholder="Explain the correct answer"
                value={question.explanation}
                onChange={(e) =>
                  updateQuestion(index, "explanation", e.target.value)
                }
              />
            </div>
          </div>
        ))}

        <Button type="button" onClick={addQuestion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>
    </div>
  );
}