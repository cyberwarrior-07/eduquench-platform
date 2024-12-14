import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quiz, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockQuizzes = [
  {
    id: 1,
    title: "JavaScript Basics",
    course: "Web Development",
    duration: "30 mins",
    questions: 20,
    status: "Available"
  },
  {
    id: 2,
    title: "React Hooks",
    course: "Advanced React",
    duration: "45 mins",
    questions: 25,
    status: "Completed"
  }
];

const Quizzes = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground">
          Test your knowledge with course quizzes
        </p>
      </div>

      <div className="grid gap-4">
        {mockQuizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl">
                {quiz.title}
              </CardTitle>
              <Quiz className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course: {quiz.course}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Timer className="h-4 w-4" />
                    <span>Duration: {quiz.duration}</span>
                  </div>
                  <p className="text-sm">Questions: {quiz.questions}</p>
                </div>
                <Button 
                  variant={quiz.status === "Completed" ? "secondary" : "default"}
                  disabled={quiz.status === "Completed"}
                >
                  {quiz.status === "Completed" ? "Completed" : "Start Quiz"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Quizzes;