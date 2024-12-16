import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Video, Calendar } from "lucide-react";

export default function LiveSessions() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['student-live-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('live_sessions')
        .select(`
          *,
          courses(title)
        `)
        .gte('start_time', new Date().toISOString())
        .order('start_time');
      
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
        <h1 className="text-3xl font-bold">Live Sessions</h1>
        <p className="text-muted-foreground">
          Join interactive live sessions with your instructors
        </p>
      </div>

      <div className="grid gap-4">
        {sessions?.map((session) => (
          <Card key={session.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl">
                {session.title}
              </CardTitle>
              <Video className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Course: {session.courses?.title}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(session.start_time).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">
                    Duration: {session.duration} minutes
                  </p>
                </div>
                {session.meeting_link && (
                  <Button 
                    as="a"
                    href={session.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Session
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}