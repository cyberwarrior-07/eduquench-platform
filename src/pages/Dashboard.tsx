import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, BarChart } from "lucide-react";
import { mockCourses } from "./Courses";
import { CourseCard } from "@/components/CourseCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const enrolledCourses = mockCourses.filter(course => !course.isLocked);
  const totalProgress = enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) / enrolledCourses.length;

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      description: "Active courses"
    },
    {
      title: "Total Hours",
      value: "32",
      icon: Clock,
      description: "Learning time"
    },
    {
      title: "Next Deadline",
      value: "2 Days",
      icon: Calendar,
      description: "Assignment due"
    },
    {
      title: "Overall Progress",
      value: `${Math.round(totalProgress)}%`,
      icon: BarChart,
      description: "Course completion"
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
        <p className="text-muted-foreground">
          Track your progress and continue learning
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Courses</h2>
          <Link 
            to="/courses" 
            className="text-sm text-primary hover:underline"
          >
            View all courses
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;