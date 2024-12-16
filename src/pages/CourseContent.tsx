import React from 'react';
import { VideoPlayerWithTranscript } from '@/components/VideoPlayerWithTranscript';
import { CourseSidebar } from '@/components/CourseSidebar';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const mockModules = [
  {
    id: '1',
    title: 'Introduction to Databases',
    duration: '1 hour, 30 mins',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to Databases Part - 1',
        duration: '30 mins',
        type: 'video' as const,
        isCompleted: true,
      },
      {
        id: '1-2',
        title: 'Introduction to Databases Part - 2',
        duration: '30 mins',
        type: 'video' as const,
      },
      {
        id: '1-3',
        title: 'Introduction to Databases Cheat Sheet',
        duration: '10 mins',
        type: 'reading' as const,
      },
      {
        id: '1-4',
        title: 'MCQ Practice',
        duration: '15 mins',
        type: 'quiz' as const,
      },
    ],
  },
  // Add more modules as needed
];

export default function CourseContent() {
  const [selectedLesson, setSelectedLesson] = React.useState(mockModules[0].lessons[0]);

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    const module = mockModules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          <VideoPlayerWithTranscript
            videoUrl="/path-to-video.mp4"
            title={selectedLesson.title}
            instructor="John Doe"
          />
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Course Content</h2>
              <p className="text-gray-500">Master the fundamentals of database management</p>
            </div>
            <Button variant="outline" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Ask doubt
            </Button>
          </div>

          <div className="prose max-w-none">
            <h3>About this lesson</h3>
            <p>
              In this comprehensive lesson, we'll dive deep into the fundamentals of
              database management systems. You'll learn about the core concepts,
              different types of databases, and how to effectively work with them.
            </p>
          </div>
        </div>
      </div>
      <div className="w-80">
        <CourseSidebar modules={mockModules} onSelectLesson={handleSelectLesson} />
      </div>
    </div>
  );
}