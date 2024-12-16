import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentTypeSelect } from "./content-builder/ContentTypeSelect";
import { ContentItem } from "./content-builder/ContentItem";
import { VideoContentForm } from "./content-types/VideoContentForm";
import { QuizContentForm } from "./content-types/QuizContentForm";
import { ChapterContentForm } from "./content-types/ChapterContentForm";
import { LessonContentForm } from "./content-types/LessonContentForm";

interface ContentItem {
  id: string;
  type: "video" | "quiz" | "chapter" | "lesson";
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
        type: newItem.type as "video" | "quiz" | "chapter" | "lesson",
        title: newItem.title,
        description: newItem.description,
        content: newItem.content,
      },
    ]);

    setNewItem({ type: 'video', title: '', description: '' });
    setIsDialogOpen(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const renderContentForm = () => {
    switch (newItem.type) {
      case "video":
        return (
          <VideoContentForm
            value={newItem.content}
            onChange={(content) => setNewItem({ ...newItem, content })}
          />
        );
      case "quiz":
        return (
          <QuizContentForm
            value={newItem.content}
            onChange={(content) => setNewItem({ ...newItem, content })}
          />
        );
      case "chapter":
        return (
          <ChapterContentForm
            value={newItem.content}
            onChange={(content) => setNewItem({ ...newItem, content })}
          />
        );
      case "lesson":
        return (
          <LessonContentForm
            value={newItem.content}
            onChange={(content) => setNewItem({ ...newItem, content })}
          />
        );
      default:
        return null;
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
              <ContentTypeSelect
                value={newItem.type as "video" | "quiz" | "chapter" | "lesson"}
                onChange={(type) => setNewItem({ ...newItem, type, content: {} })}
              />
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
              {renderContentForm()}
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
                    >
                      <ContentItem
                        {...item}
                        onRemove={handleRemoveItem}
                        dragHandleProps={provided.dragHandleProps}
                      />
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
