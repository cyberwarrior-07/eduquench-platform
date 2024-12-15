import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock query for demonstration - replace with actual API call
  const { data: events } = useQuery({
    queryKey: ['schedule-events'],
    queryFn: async () => {
      // This would be your actual API call
      return [
        { 
          id: 1, 
          title: 'Web Development Course', 
          date: new Date(), 
          type: 'course'
        },
        { 
          id: 2, 
          title: 'UI/UX Design Webinar', 
          date: new Date(Date.now() + 86400000), 
          type: 'webinar'
        }
      ];
    },
  });

  console.log('Schedule events:', events);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Schedule</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events?.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-500">
                      {event.date.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {event.type}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;