import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare } from "lucide-react";

const Discussions = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mentor Support</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Schedule a Call</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-500">
                Book a one-on-one session with your mentor to discuss your progress
                and get personalized guidance.
              </p>
              <Button className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Call
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-500">
                Get quick answers to your questions through our chat support system.
              </p>
              <Button variant="outline" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Discussions;