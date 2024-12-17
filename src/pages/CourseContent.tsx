import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CourseSidebar } from '@/components/CourseSidebar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CourseContent, Module, VideoContent, Lesson } from '@/types/courseContent';
import { Json } from '@/integrations/supabase/types';

export default function CourseContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { courseId } = useParams();

  const { data: course, isLoading: courseLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) {
        toast.error('Failed to load course');
        throw error;
      }

      return data;
    },
  });

  const { data: contents = [], isLoading: contentsLoading } = useQuery({
    queryKey: ['course-contents', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_content')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');

      if (error) {
        toast.error('Failed to load course content');
        throw error;
      }

      // Transform the data to match our CourseContent type
      return data.map((item: any) => ({
        ...item,
        content: typeof item.content === 'string' 
          ? JSON.parse(item.content) 
          : item.content
      }));
    },
  });

  if (courseLoading || contentsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading course content...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-gray-600">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Find the first video content
  const firstVideoContent = contents.find(
    (content: CourseContent) => content.type === 'video'
  );

  // Safely type cast the content to VideoContent
  const videoContent = firstVideoContent?.content as VideoContent | undefined;
  const videoUrl = videoContent?.videoUrl || '';

  // Transform contents to modules format for sidebar
  const modules: Module[] = contents.reduce((acc: Module[], content: CourseContent) => {
    // Convert content to lesson format
    const lesson: Lesson = {
      id: content.id,
      title: content.title,
      duration: content.type === 'video' ? '10:00' : '5:00', // Default durations
      type: content.type === 'chapter' ? 'reading' : content.type as 'video' | 'quiz' | 'reading',
      isCompleted: false // You might want to fetch this from student progress
    };

    // If this is the first item or a new module, create a new module
    if (acc.length === 0 || acc[acc.length - 1].lessons.length >= 5) { // Group lessons into modules of 5
      acc.push({
        id: `module-${acc.length + 1}`,
        title: `Module ${acc.length + 1}`,
        duration: '1 week', // Default module duration
        lessons: [lesson]
      });
    } else {
      // Add lesson to the current module
      acc[acc.length - 1].lessons.push(lesson);
    }

    return acc;
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <CourseSidebar 
          modules={modules} 
          onSelectLesson={() => {}} 
        />
      </div>

      <div className={`flex-1 ${isSidebarOpen ? 'ml-72' : ''}`}>
        <div className="p-4">
          <Button
            variant="outline"
            size="icon"
            className="mb-4"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? '←' : '→'}
          </Button>

          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              {videoUrl && (
                <VideoPlayer 
                  videoUrl={videoUrl} 
                  title={firstVideoContent?.title || ''} 
                />
              )}
            </div>

            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{course.title}</h1>
              <p className="text-gray-600">{course.description}</p>
            </div>

            {firstVideoContent && (
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-2">
                  {firstVideoContent.title}
                </h2>
                <p>{firstVideoContent.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}