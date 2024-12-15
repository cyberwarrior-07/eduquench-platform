import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Calendar, Clock, BarChart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockCourses } from "./Courses";
import { CourseCard } from "@/components/CourseCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const enrolledCourses = mockCourses.filter(course => !course.isLocked);
  const totalProgress = enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) / enrolledCourses.length;

  const currentMonth = "June 2024";
  const dailyActivityData = [
    { month: "Jan", study: 40, test: 30 },
    { month: "Feb", study: 35, test: 25 },
    { month: "Mar", study: 55, test: 45 },
    { month: "Apr", study: 45, test: 35 },
    { month: "May", study: 30, test: 20 },
  ];

  const upcomingSessions = [
    {
      title: "UX Design Fundamentals",
      time: "5:30pm",
      status: "join",
    },
    {
      title: "Interaction Design",
      time: "9:00pm",
      status: "upcoming",
    },
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Hello Harsh 👋</h1>
        <p className="text-gray-500">
          Let's learn something new today!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Course Progress Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Course Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Product Design Course</p>
                  <p className="text-sm text-gray-500">14/20 class</p>
                </div>
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <Progress value={70} className="h-2 bg-primary-100" />
            </div>
          </CardContent>
        </Card>

        {/* Certification Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Your Certification and Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-red-500 rounded" />
                <div>
                  <p className="font-medium">Auto-layout.pdf</p>
                  <p className="text-sm text-gray-500">8.5 MB</p>
                </div>
              </div>
              <Button variant="ghost" className="text-primary hover:text-primary-700">
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-green-500 rounded" />
                <div>
                  <p className="font-medium">Design_Tips.png</p>
                  <p className="text-sm text-gray-500">5.2 MB</p>
                </div>
              </div>
              <Button variant="ghost" className="text-primary hover:text-primary-700">
                Download
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Calendar</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{currentMonth}</span>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className={`text-sm p-1 rounded-full ${
                    i === 9 ? "bg-primary text-white" : ""
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Activity Card */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Daily Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-end gap-8">
              {dailyActivityData.map((data) => (
                <div key={data.month} className="flex-1 space-y-2">
                  <div className="flex flex-col gap-1">
                    <div
                      className="bg-primary/20"
                      style={{ height: `${data.test}px` }}
                    />
                    <div
                      className="bg-primary"
                      style={{ height: `${data.study}px` }}
                    />
                  </div>
                  <div className="text-sm text-center text-gray-500">
                    {data.month}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-primary rounded" />
                <span className="text-sm text-gray-500">Study</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-primary/20 rounded" />
                <span className="text-sm text-gray-500">Online Test</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative h-32 w-32">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-primary-100"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="10"
                  />
                  <circle
                    className="stroke-primary"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="10"
                    strokeDasharray="283"
                    strokeDashoffset="70"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">8.966</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">Your Grade</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Classes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent enrolled classes</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              All
            </Button>
            <Button variant="ghost" size="icon">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {enrolledCourses.slice(0, 2).map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        5:30hrs
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        05 Lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Assignments
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Upcoming Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcomingSessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-500">{session.time}</p>
                </div>
              </div>
              <Button
                variant={session.status === "join" ? "default" : "outline"}
                className={session.status === "join" ? "bg-primary" : ""}
              >
                {session.status === "join" ? "Join" : "Stay Tuned"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;