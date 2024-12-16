import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { Clock, BookOpen, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export default function StudentDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['student-courses'],
    queryFn: async () => {
      console.log('Fetching student courses...');
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          student_progress(progress)
        `)
        .eq('is_published', true);
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
        throw error;
      }
      console.log('Courses fetched:', data);
      return data;
    },
  });

  const { data: upcomingLiveSessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['upcoming-live-sessions'],
    queryFn: async () => {
      console.log('Fetching upcoming live sessions...');
      const { data, error } = await supabase
        .from('live_sessions')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time')
        .limit(5);
      
      if (error) {
        console.error('Error fetching live sessions:', error);
        toast.error('Failed to load upcoming sessions');
        throw error;
      }
      console.log('Live sessions fetched:', data);
      return data;
    },
  });

  if (coursesLoading || sessionsLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Course Progress Overview */}
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses?.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium truncate">{course.title}</span>
                    <span className="text-sm text-muted-foreground">
                      {course.student_progress?.[0]?.progress || 0}%
                    </span>
                  </div>
                  <Progress value={course.student_progress?.[0]?.progress || 0} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Upcoming Live Sessions */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Upcoming Live Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingLiveSessions?.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No upcoming live sessions scheduled
                </p>
              ) : (
                upcomingLiveSessions?.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div>
                      <h3 className="font-medium">{session.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.start_time).toLocaleString()}
                      </p>
                    </div>
                    {session.meeting_link && (
                      <a
                        href={session.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Join Meeting
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses?.map((course) => (
                <CourseCard
                  key={course.id}
                  course={{
                    id: course.id,
                    title: course.title,
                    description: course.description || '',
                    thumbnail: course.thumbnail_url || '/placeholder.svg',
                    duration: '2 hours', // This should come from the course data
                    lessons: 12, // This should come from the course data
                    level: 'Beginner', // This should come from the course data
                    progress: course.student_progress?.[0]?.progress || 0,
                    isLocked: false,
                    objectives: [],
                    requirements: [],
                    instructor: 'John Doe', // This should come from the course data
                    category: 'Development', // This should come from the course data
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}