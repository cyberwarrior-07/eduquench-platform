import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardStats } from "@/components/student/DashboardStats";
import { LiveSessionsList } from "@/components/student/LiveSessionsList";
import { EnrolledCourses } from "@/components/student/EnrolledCourses";
import { Slider } from "@/components/ui/slider";

export default function StudentDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sliderValue, setSliderValue] = useState([50]);

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
        <DashboardStats courses={courses || []} />

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

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Slider
              defaultValue={sliderValue}
              max={100}
              step={1}
              onValueChange={setSliderValue}
              className="w-full"
            />
            <p className="text-center mt-2">{sliderValue}%</p>
          </CardContent>
        </Card>

        <LiveSessionsList sessions={upcomingLiveSessions || []} />
        <EnrolledCourses courses={courses || []} />
      </div>
    </div>
  );
}