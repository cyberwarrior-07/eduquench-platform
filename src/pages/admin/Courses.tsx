import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CourseList from "./courses/CourseList";

export default function AdminCourses() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and their content
          </p>
        </div>
        <Button onClick={() => navigate("/admin/courses/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Course
        </Button>
      </div>

      <CourseList />
    </div>
  );
}