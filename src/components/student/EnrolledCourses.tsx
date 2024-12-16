import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";

interface EnrolledCoursesProps {
  courses: any[];
}

export const EnrolledCourses = ({ courses }: EnrolledCoursesProps) => {
  return (
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
                duration: '2 hours',
                lessons: 12,
                level: 'Beginner',
                enrollmentStatus: 'Open',
                progress: course.student_progress?.[0]?.progress || 0,
                isLocked: false,
                objectives: [],
                requirements: [],
                instructor: 'John Doe',
                category: 'Development',
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};