import React, { useState } from 'react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { CourseSidebar } from '@/components/CourseSidebar';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu } from 'lucide-react';
import { useParams, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function CourseContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { id } = useParams();

  console.log('Course ID from params:', id);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      if (!id) {
        console.error('No course ID provided');
        throw new Error('No course ID provided');
      }
      
      console.log('Fetching course with ID:', id);
      
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          mentor:profiles!courses_mentor_id_fkey (
            username,
            avatar_url
          ),
          course_content (
            id,
            title,
            type,
            content
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching course:', error);
        toast.error('Error fetching course');
        throw error;
      }

      console.log('Course data:', data);
      return data;
    },
  });

  if (error) {
    console.error('Query error:', error);
    toast.error('Failed to load course');
    return <Navigate to="/courses" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-gray-200 rounded-lg w-full max-w-4xl"></div>
          <div className="h-8 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Find the first video content
  const firstVideoContent = course.course_content?.find(
    (content: any) => content.type === 'video'
  );

  const videoUrl = firstVideoContent?.content?.videoUrl || '';

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Ask a Question
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'mr-80' : ''}`}>
          <div className="max-w-5xl mx-auto p-6 space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
              <VideoPlayer
                videoUrl={videoUrl}
                title={firstVideoContent?.title || course.title}
                instructor={course.mentor?.username}
              />
            </div>
            
            <div className="prose max-w-none dark:prose-invert">
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-muted-foreground">{course.description}</p>
            </div>

            {firstVideoContent && (
              <div className="prose max-w-none dark:prose-invert">
                <h2 className="text-2xl font-semibold">
                  {firstVideoContent.title}
                </h2>
                <p className="text-muted-foreground">
                  {firstVideoContent.content?.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`fixed right-0 top-[73px] h-[calc(100vh-73px)] w-80 bg-background border-l transition-transform duration-300 transform ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <CourseSidebar
            modules={course.course_content || []}
            onSelectLesson={() => {}}
            className="h-full overflow-y-auto"
          />
        </div>
      </div>
    </div>
  );
}