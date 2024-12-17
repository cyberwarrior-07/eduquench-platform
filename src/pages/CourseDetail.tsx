import { useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, GraduationCap, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type BaseCourseType = Database['public']['Tables']['courses']['Row'];

interface CourseWithMentor extends BaseCourseType {
  mentor: {
    username: string | null;
    avatar_url: string | null;
  } | null;
  duration: string;
  lessons: number;
  level: string;
  enrollmentStatus: string;
  isLocked: boolean;
  objectives: string[];
  requirements: string[];
  progress: number;
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  
  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      console.log('Fetching course with ID:', id);
      
      if (!id) {
        console.error('No course ID provided');
        throw new Error('No course ID provided');
      }

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

      console.log('Course data:', data);
      
      // Transform the data into CourseWithMentor type
      const courseWithMentor: CourseWithMentor = {
        ...data,
        duration: '10 weeks', // Default value
        lessons: 12, // Default value
        level: 'Beginner', // Default value
        enrollmentStatus: data.is_published ? 'Open' : 'Closed',
        isLocked: !data.is_published,
        objectives: [],
        requirements: [],
        progress: 0,
      };

      return courseWithMentor;
    },
    enabled: !!id, // Only run query if we have an ID
  });

  if (!id) {
    return <div className="container mx-auto py-8">No course ID provided</div>;
  }

  if (isLoading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (!course) {
    return <div className="container mx-auto py-8">Course not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="relative">
            <img
              src={course.thumbnail_url || '/placeholder.svg'}
              alt={course.title}
              className="w-full h-[400px] object-cover rounded-lg"
            />
            {course.isLocked && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <Button size="lg">Unlock Course</Button>
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-600 mt-2">{course.description}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-gray-500" />
              <span>{course.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-gray-500" />
              <span>{course.level}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <span>{course.enrollmentStatus}</span>
            </div>
          </div>

          {course.progress !== undefined && (
            <div>
              <div className="flex justify-between mb-2">
                <span>Course Progress</span>
                <span>{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold mb-4">What you'll learn</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {objective}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
            <ul className="list-disc pl-5 space-y-2">
              {course.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="border rounded-lg p-6 space-y-6">
            <div className="flex items-center gap-4">
              <img
                src={course.mentor?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${course.mentor?.username || 'Instructor'}`}
                alt={course.mentor?.username || 'Instructor'}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-semibold">{course.mentor?.username || 'Instructor'}</p>
                <p className="text-sm text-gray-600">Course Instructor</p>
              </div>
            </div>

            <Button className="w-full" disabled={course.isLocked}>
              {course.isLocked ? "Unlock Course" : "Continue Learning"}
            </Button>

            <div className="space-y-2">
              <Badge variant="outline" className="w-full justify-center">
                {course.level}
              </Badge>
              <Badge variant="outline" className="w-full justify-center">
                {course.enrollmentStatus}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}