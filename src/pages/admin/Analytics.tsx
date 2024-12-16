import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', users: 400, courses: 240 },
  { name: 'Feb', users: 300, courses: 139 },
  { name: 'Mar', users: 200, courses: 980 },
  { name: 'Apr', users: 278, courses: 390 },
  { name: 'May', users: 189, courses: 480 },
];

export default function AdminAnalytics() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">View your platform analytics</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Growth Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <LineChart width={800} height={400} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#8884d8" />
              <Line type="monotone" dataKey="courses" stroke="#82ca9d" />
            </LineChart>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}