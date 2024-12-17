import React, { useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CourseSidebar } from '@/components/CourseSidebar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, Lock } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  console.log('Course ID from params:', id); // Debug log

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) {
        console.error('No course ID provided');
        throw new Error('No course ID provided');
      }
      
      console.log('Fetching course with ID:', id); // Debug log
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          mentor:profiles!courses_mentor_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching course:', error);
        toast.error('Error fetching course');
        throw error;
      }

      console.log('Course data:', data); // Debug log
      return data;
    },
    enabled: !!id, // Only run query if we have an ID
  });

  if (error) {
    console.error('Query error:', error);
    toast.error('Failed to load course');
    return <Navigate to="/courses" replace />;
  }

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  if (!course.is_published) {
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

      <div className="flex gap-6">
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-80' : ''}`}>
          <div className="max-w-5xl mx-auto space-y-6">
            <VideoPlayer
              videoUrl="/path-to-video.mp4"
              title={selectedLesson.title}
              instructor={course.mentor?.username || 'TBD'}
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

        <div
          className={`fixed right-0 top-14 h-[calc(100vh-3.5rem)] w-80 transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <CourseSidebar
            modules={mockModules}
            onSelectLesson={handleSelectLesson}
            className="border-l border-border h-full"
          />
        </div>
      </div>
    </div>
  );
}