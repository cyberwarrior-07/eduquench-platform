import { Course } from "@/types/course";
import { Lock, Clock, BookOpen } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();

  const handleCourseAccess = () => {
    if (course.isLocked) {
      toast.error("Please complete the prerequisites to unlock this course.");
      return;
    }
    navigate(`/course/${course.id}`);
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-48 w-full object-cover"
          />
          {course.isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Lock className="h-8 w-8 text-white" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge variant={course.isLocked ? "secondary" : "default"}>
              {course.level}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold">{course.title}</h3>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {course.description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span>{course.lessons} lessons</span>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${course.instructor}`}
            alt={course.instructor}
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm text-gray-600">{course.instructor}</span>
        </div>
        {course.progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="text-gray-600">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2 mt-1" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleCourseAccess}
          className="w-full"
          variant={course.isLocked ? "secondary" : "default"}
        >
          {course.isLocked ? "Unlock Course" : "Continue Learning"}
        </Button>
      </CardFooter>
    </Card>
  );
};