import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, BookOpen, FileText, Clock, Lock } from "lucide-react";
import { mockCourses } from "./Courses";

const CourseDetail = () => {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container py-8 animate-fade-in">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video rounded-lg bg-gray-100 dark:bg-gray-800 relative">
            {course.isLocked ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                  <Lock className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-white font-medium">
                    Unlock this course to access content
                  </p>
                  <Button className="mt-4">Unlock Course</Button>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Play Video
                </Button>
              </div>
            )}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <Card key={index}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Play className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">Lesson {index + 1}</h3>
                          <p className="text-sm text-muted-foreground">
                            Introduction to the course
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          10:30
                        </span>
                        {course.isLocked && <Lock className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="overview">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h3 className="text-lg font-semibold">About this course</h3>
                  <p className="text-muted-foreground">
                    This comprehensive course will take you through all the
                    essential concepts and practical applications. Perfect for
                    beginners and intermediate learners alike.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="resources">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <h3 className="text-lg font-semibold">Course Materials</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <span>Resource {index + 1}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span>{course.lessons} lessons</span>
                  </div>
                </div>

                {course.progress !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                )}

                <Button className="w-full" disabled={!course.isLocked}>
                  {course.isLocked ? "Unlock Course" : "Continue Learning"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div>
                  <h4 className="font-medium">{course.instructor}</h4>
                  <p className="text-sm text-muted-foreground">
                    Course Instructor
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;