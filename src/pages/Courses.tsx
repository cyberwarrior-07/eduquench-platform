import { CourseCard } from "@/components/CourseCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { Course } from "@/types/course";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "Introduction to UX Design",
    description: "Learn the fundamentals of UX design and user-centered design principles.",
    thumbnail: "/placeholder.svg",
    duration: "10 weeks",
    lessons: 12,
    level: "Beginner",
    enrollmentStatus: "Open",
    progress: 70,
    isLocked: false,
    objectives: [
      "Understand UX design principles",
      "Learn user research methods",
      "Create wireframes and prototypes",
      "Conduct usability testing"
    ],
    requirements: [
      "No prior experience required",
      "Basic computer skills",
      "Design software will be provided"
    ],
    instructor: "Sarah Johnson",
    category: "Design"
  },
  {
    id: "2",
    title: "Advanced Web Development",
    description: "Master modern web development techniques and frameworks.",
    thumbnail: "/placeholder.svg",
    duration: "12 weeks",
    lessons: 15,
    level: "Advanced",
    enrollmentStatus: "Open",
    progress: 30,
    isLocked: false,
    objectives: [
      "Build full-stack web applications",
      "Master modern JavaScript frameworks",
      "Implement authentication and security",
      "Deploy applications to production"
    ],
    requirements: [
      "Basic JavaScript knowledge",
      "Understanding of HTML/CSS",
      "Familiarity with web concepts"
    ],
    instructor: "Michael Chen",
    category: "Development"
  },
  {
    id: "3",
    title: "Data Science Fundamentals",
    description: "Introduction to data science and machine learning concepts.",
    thumbnail: "/placeholder.svg",
    duration: "8 weeks",
    lessons: 10,
    level: "Intermediate",
    enrollmentStatus: "Closed",
    isLocked: true,
    objectives: [
      "Understand data analysis techniques",
      "Learn Python for data science",
      "Implement machine learning models",
      "Visualize data effectively"
    ],
    requirements: [
      "Basic Python knowledge",
      "Understanding of statistics",
      "Mathematical background"
    ],
    instructor: "Emily Brown",
    category: "Data Science"
  }
];

const Courses = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_published', true);
      
      if (error) {
        toast.error('Error fetching courses');
        throw error;
      }
      return data || [];
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
