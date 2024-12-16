import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { ChevronDown, PlayCircle, FileText, CheckCircle2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'quiz' | 'reading';
  isCompleted?: boolean;
}

interface CourseSidebarProps {
  modules: Module[];
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  className?: string;
}

export const CourseSidebar = ({ modules, onSelectLesson, className }: CourseSidebarProps) => {
  return (
    <div className={`w-full h-full bg-background border-l ${className}`}>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:text-primary">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{module.title}</span>
                    <span className="text-xs text-muted-foreground">{module.duration}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-1">
                    {module.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className="w-full justify-start gap-2 h-auto py-2 px-2 text-left hover:bg-muted"
                        onClick={() => onSelectLesson(module.id, lesson.id)}
                      >
                        {lesson.type === 'video' && (
                          <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                        )}
                        {lesson.type === 'reading' && (
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                        )}
                        <div className="flex flex-col items-start">
                          <span className="text-sm">{lesson.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </div>
                        {lesson.isCompleted && (
                          <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto shrink-0" />
                        )}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};