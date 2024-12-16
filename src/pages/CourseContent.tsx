import React, { useState } from 'react';
import { VideoPlayerWithTranscript } from '@/components/VideoPlayerWithTranscript';
import { CourseSidebar } from '@/components/CourseSidebar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, Lock } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { mockCourses } from './Courses';
import { toast } from 'sonner';

const mockModules = [
  {
    id: '1',
    title: 'Introduction to the Course',
    duration: '1 hour, 30 mins',
    lessons: [
      {
        id: '1-1',
        title: 'Welcome to the Course',
        duration: '10 mins',
        type: 'video' as const,
        isCompleted: true,
      },
      {
        id: '1-2',
        title: 'Course Overview',
        duration: '15 mins',
        type: 'video' as const,
        isCompleted: true,
      },
      {
        id: '1-3',
        title: 'Getting Started Guide',
        duration: '10 mins',
        type: 'reading' as const,
        isCompleted: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Core Concepts',
    duration: '2 hours',
    lessons: [
      {
        id: '2-1',
        title: 'Understanding the Basics',
        duration: '20 mins',
        type: 'video' as const,
        isCompleted: false,
      },
      {
        id: '2-2',
        title: 'Advanced Topics',
        duration: '25 mins',
        type: 'video' as const,
        isCompleted: false,
      },
    ],
  },
];

export default function CourseContent() {
  const [selectedLesson, setSelectedLesson] = useState(mockModules[0].lessons[0]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  if (course.isLocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Lock className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-2xl font-bold">Course Locked</h1>
          <p className="text-muted-foreground">
            Complete the prerequisites to unlock this course.
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleSelectLesson = (moduleId: string, lessonId: string) => {
    const module = mockModules.find((m) => m.id === moduleId);
    const lesson = module?.lessons.find((l) => l.id === lessonId);
    if (lesson) {
      setSelectedLesson(lesson);
      toast.success(`Started lesson: ${lesson.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-80' : ''}`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="hover:bg-muted"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Ask doubt
              </Button>
            </div>

            <div className="max-w-5xl mx-auto space-y-6">
              <VideoPlayerWithTranscript
                videoUrl="/path-to-video.mp4"
                title={selectedLesson.title}
                instructor={course.instructor}
              />
              
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                <p className="text-muted-foreground">{course.description}</p>
              </div>

              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-2">About this lesson</h3>
                <p className="text-muted-foreground">
                  This lesson covers the fundamental concepts and provides a comprehensive
                  introduction to the topic. Follow along with the video and make sure to
                  complete the exercises at the end.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`fixed right-0 top-0 h-screen w-80 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <CourseSidebar
            modules={mockModules}
            onSelectLesson={handleSelectLesson}
            className="border-l border-border"
          />
        </div>
      </div>
    </div>
  );
}