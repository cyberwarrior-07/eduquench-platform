import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Video, FileText, Folder, Trash2 } from "lucide-react";
import { ContentType } from "../content-types/types";

interface ContentItemProps {
  id: string;
  type: ContentType;
  title: string;
  description?: string;
  onRemove: (id: string) => void;
  dragHandleProps?: any;
}

export function ContentItem({ id, type, title, description, onRemove, dragHandleProps }: ContentItemProps) {
  const getItemIcon = (type: ContentType) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'quiz':
        return <FileText className="h-4 w-4" />;
      case 'chapter':
        return <Folder className="h-4 w-4" />;
      case 'live-class':
        return <Video className="h-4 w-4 text-blue-500" />; // Using Video icon with different color for live classes
      default:
        return null;
    }
  };

  const getItemBadgeColor = (type: ContentType) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      case 'chapter':
        return 'bg-purple-100 text-purple-800';
      case 'live-class':
        return 'bg-orange-100 text-orange-800';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-background border rounded-lg group hover:border-primary/50 transition-colors">
      <div {...dragHandleProps}>
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={getItemBadgeColor(type)}>
            <span className="flex items-center gap-1">
              {getItemIcon(type)}
              {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
            </span>
          </Badge>
          <span className="font-medium">{title}</span>
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}