import React from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { ChevronDown, PlayCircle, FileText } from 'lucide-react';
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
}

export const CourseSidebar = ({ modules, onSelectLesson }: CourseSidebarProps) => {
  return (
    <div className="w-full h-full bg-white border-l">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="p-4">
          <Accordion type="single" collapsible className="w-full">
            {modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:text-primary">
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{module.title}</span>
                    <span className="text-xs text-gray-500">{module.duration}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className="w-full justify-start gap-2 h-auto py-2"
                        onClick={() => onSelectLesson(module.id, lesson.id)}
                      >
                        {lesson.type === 'video' && (
                          <PlayCircle className="h-4 w-4 text-primary" />
                        )}
                        {lesson.type === 'reading' && (
                          <FileText className="h-4 w-4 text-primary" />
                        )}
                        <div className="flex flex-col items-start">
                          <span className="text-sm">{lesson.title}</span>
                          <span className="text-xs text-gray-500">
                            {lesson.duration}
                          </span>
                        </div>
                        {lesson.isCompleted && (
                          <div className="ml-auto">
                            <div className="h-2 w-2 rounded-full bg-green-500" />
                          </div>
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