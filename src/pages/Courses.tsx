import { CourseCard } from "@/components/CourseCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface DBCourse {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  status: string;
  created_by: string | null;
  mentor_id: string | null;
  created_at: string;
  updated_at: string;
  price: number | null;
  currency: string | null;
  is_published: boolean | null;
}

const mapDBCourseToCourse = (dbCourse: DBCourse): Course => ({
  id: dbCourse.id,
  title: dbCourse.title,
  description: dbCourse.description || '',
  thumbnail: dbCourse.thumbnail_url || '/placeholder.svg',
  duration: '10 weeks', // Default value
  lessons: 12, // Default value
  level: 'Beginner', // Default value
  enrollmentStatus: dbCourse.is_published ? 'Open' : 'Closed',
  isLocked: !dbCourse.is_published,
  objectives: [],
  requirements: [],
  instructor: dbCourse.mentor_id || 'TBD',
  category: 'General', // Default category
});

const Courses = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: dbCourses, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      console.log('Fetching courses...');
      let query = supabase
        .from('courses')
        .select('*');
      
      // Only fetch published courses
      query = query.eq('is_published', true);
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching courses:', error);
        toast.error('Error fetching courses');
        throw error;
      }

      console.log('Courses fetched:', data);
      return data || [];
    },
  });

  if (error) {
    console.error('Query error:', error);
    toast.error('Failed to load courses');
    return <div>Error loading courses</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const courses = dbCourses.map(mapDBCourseToCourse);

  const filteredCourses = courses.filter(course =>
    selectedCategory === "all" ? true : course.category === selectedCategory
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Available Courses</h1>
        <Select onValueChange={setSelectedCategory} defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Frontend Development">Frontend Development</SelectItem>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;