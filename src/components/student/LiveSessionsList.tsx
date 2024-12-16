import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

interface LiveSession {
  id: string;
  title: string;
  start_time: string;
  meeting_link?: string;
  courses?: {
    title: string;
  };
}

interface LiveSessionsListProps {
  sessions?: LiveSession[];
}

const fetchLiveSessions = async () => {
  console.log('Fetching live sessions...');
  const { data, error } = await supabase
    .from('live_sessions')
    .select('*, courses(title)')
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });

  if (error) {
    console.error('Error fetching live sessions:', error);
    throw error;
  }

  console.log('Live sessions fetched:', data);
  return data;
};

export const LiveSessionsList = ({ sessions: propSessions }: LiveSessionsListProps) => {
  const { data: sessions, error, isLoading } = useQuery({
    queryKey: ['live-sessions'],
    queryFn: fetchLiveSessions,
    initialData: propSessions,
    retry: 1,
    onError: (error) => {
      console.error('Error in live sessions query:', error);
      toast.error('Failed to load live sessions');
    }
  });

  if (error) {
    console.error('Rendering error state:', error);
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upcoming Live Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-muted-foreground text-center py-4">
              Loading sessions...
            </p>
          ) : sessions?.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No upcoming live sessions scheduled
            </p>
          ) : (
            sessions?.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.start_time).toLocaleString()}
                  </p>
                  {session.courses?.title && (
                    <p className="text-sm text-muted-foreground">
                      Course: {session.courses.title}
                    </p>
                  )}
                </div>
                {session.meeting_link && (
                  <a
                    href={session.meeting_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};