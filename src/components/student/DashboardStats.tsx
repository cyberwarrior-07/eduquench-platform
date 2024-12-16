import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface DashboardStatsProps {
  courses: any[];
}

export const DashboardStats = ({ courses }: DashboardStatsProps) => {
  return (
    <Card className="col-span-full md:col-span-2 bg-white border border-gray-100 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <BookOpen className="h-5 w-5" />
          Course Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses?.map((course) => (
            <div key={course.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium truncate text-gray-900">{course.title}</span>
                <span className="text-sm text-gray-600">
                  {course.student_progress?.[0]?.progress || 0}%
                </span>
              </div>
              <Progress 
                value={course.student_progress?.[0]?.progress || 0}
                className="bg-gray-100"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};