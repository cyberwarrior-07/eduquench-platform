import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { BookCheck, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StudentQuizzes() {
  const navigate = useNavigate();

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['student-quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_content')
        .select(`
          *,
          courses!inner(title),
          quiz_attempts(completed_at, score)
        `)
        .eq('type', 'quiz')
        .eq('is_published', true);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Quizzes</h1>
        <p className="text-muted-foreground">
          Test your knowledge with course quizzes
        </p>
      </div>

      <div className="grid gap-4">
        {quizzes?.map((quiz) => {
          const latestAttempt = quiz.quiz_attempts?.[0];
          const isCompleted = !!latestAttempt?.completed_at;

          return (
            <Card key={quiz.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl">
                  {quiz.title}
                </CardTitle>
                <BookCheck className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Course: {quiz.courses.title}
                    </p>
                    {isCompleted && (
                      <p className="text-sm text-green-600">
                        Score: {latestAttempt.score}%
                      </p>
                    )}
                  </div>
                  <Button 
                    onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                    variant={isCompleted ? "secondary" : "default"}
                  >
                    {isCompleted ? "Review Quiz" : "Start Quiz"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}