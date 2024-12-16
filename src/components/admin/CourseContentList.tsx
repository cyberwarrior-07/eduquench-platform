import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddContentForm } from "./course-content/AddContentForm";
import { ContentList } from "./course-content/ContentList";
import { useContentManagement } from "./course-content/useContentManagement";

interface CourseContentListProps {
  courseId: string;
}

export function CourseContentList({ courseId }: CourseContentListProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { contents, isLoading, createContent, deleteContent } = useContentManagement(courseId);

  const handleSubmit = (formData: any) => {
    createContent(formData);
    setIsOpen(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Course Content</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Content
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Course Content</DialogTitle>
            </DialogHeader>
            <AddContentForm onSubmit={handleSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <ContentList contents={contents} onDelete={deleteContent} />
    </div>
  );
}