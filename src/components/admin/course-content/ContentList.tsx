import { Button } from "@/components/ui/button";
import { Video, FileText, BookOpen, Trash2, Folder } from "lucide-react";
import { ContentType } from "./AddContentForm";

interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
}

interface ContentListProps {
  contents: Content[];
  onDelete: (id: string) => void;
}

export function ContentList({ contents, onDelete }: ContentListProps) {
  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "quiz":
        return <FileText className="h-4 w-4" />;
      case "chapter":
        return <Folder className="h-4 w-4" />;
      case "lesson":
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {contents?.map((content) => (
        <div
          key={content.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gray-100 p-2 rounded-full">
              {getContentIcon(content.type)}
            </div>
            <div>
              <h3 className="font-medium">{content.title}</h3>
              <p className="text-sm text-gray-500">{content.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(content.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}