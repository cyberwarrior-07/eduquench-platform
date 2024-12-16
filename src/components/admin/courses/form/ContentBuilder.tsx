import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Video, FileText, BookOpen, Trash2, Folder } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface ContentItem {
  id: string;
  type: 'video' | 'quiz' | 'chapter' | 'lesson';
  title: string;
  description?: string;
  content?: any;
}

export function ContentBuilder() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ContentItem>>({
    type: 'video',
    title: '',
    description: '',
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  const handleAddItem = () => {
    if (!newItem.title) return;

    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        type: newItem.type as 'video' | 'quiz' | 'chapter' | 'lesson',
        title: newItem.title,
        description: newItem.description,
      },
    ]);

    setNewItem({ type: 'video', title: '', description: '' });
    setIsDialogOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'quiz':
        return <FileText className="h-4 w-4" />;
      case 'chapter':
        return <Folder className="h-4 w-4" />;
      case 'lesson':
        return <BookOpen className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getItemBadgeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'quiz':
        return 'bg-green-100 text-green-800';
      case 'chapter':
        return 'bg-purple-100 text-purple-800';
      case 'lesson':
        return 'bg-orange-100 text-orange-800';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Course Content</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Course Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Content Type</Label>
                <Select
                  value={newItem.type}
                  onValueChange={(value: 'video' | 'quiz' | 'chapter' | 'lesson') =>
                    setNewItem({ ...newItem, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="chapter">Chapter</SelectItem>
                    <SelectItem value="lesson">Lesson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) =>
                    setNewItem({ ...newItem, title: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddItem}>Add</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="content">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-center gap-4 p-4 bg-background border rounded-lg group hover:border-primary/50 transition-colors"
                    >
                      <div {...provided.dragHandleProps}>
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getItemBadgeColor(item.type)}>
                            <span className="flex items-center gap-1">
                              {getItemIcon(item.type)}
                              {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            </span>
                          </Badge>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}