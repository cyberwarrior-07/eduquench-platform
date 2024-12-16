import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon, BookOpen, GraduationCap, Clock } from "lucide-react";
import { toast } from "sonner";
import { DashboardStats } from "@/components/student/DashboardStats";
import { LiveSessionsList } from "@/components/student/LiveSessionsList";
import { EnrolledCourses } from "@/components/student/EnrolledCourses";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [progress, setProgress] = useState(50);

  const { data: profile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        throw error;
      }

      return data;
    },
  });

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

  const { data: upcomingLiveSessions } = useQuery({
    queryKey: ['upcoming-live-sessions'],
    queryFn: async () => {
      console.log('Fetching upcoming live sessions...');
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses(title)
        `)
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

  if (coursesLoading) {
    return (
      <div className="w-full h-full p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-100 rounded"></div>
            <div className="h-64 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] p-4 md:p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Hello, {profile?.username || 'Student'}! 👋
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="col-span-full md:col-span-2 bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <BookOpen className="h-5 w-5" />
              Learning Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={progress} className="w-full h-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>Overall Progress</span>
                <span>{progress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-full md:col-span-1 bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <CalendarIcon className="h-5 w-5" />
              Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-gray-100"
            />
          </CardContent>
        </Card>

        <Card className="col-span-full bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <GraduationCap className="h-5 w-5" />
              Enrolled Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EnrolledCourses courses={courses || []} />
          </CardContent>
        </Card>

        <Card className="col-span-full bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Clock className="h-5 w-5" />
              Upcoming Live Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LiveSessionsList sessions={upcomingLiveSessions || []} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}