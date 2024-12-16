import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface TopicGeneratorProps {
  topic: string;
  isGenerating: boolean;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
}

export function TopicGenerator({
  topic,
  isGenerating,
  onTopicChange,
  onGenerate,
}: TopicGeneratorProps) {
  return (
    <div className="flex gap-4 items-end">
      <div className="flex-1">
        <Label htmlFor="topic">Topic for AI Generation</Label>
        <Input
          id="topic"
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          placeholder="Enter topic for quiz generation"
        />
      </div>
      <Button onClick={onGenerate} disabled={isGenerating}>
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Generate Questions
      </Button>
    </div>
  );
}