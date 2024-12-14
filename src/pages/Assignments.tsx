import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList, Clock } from "lucide-react";

const mockAssignments = [
  {
    id: 1,
    title: "React Fundamentals",
    course: "Web Development",
    dueDate: "2024-03-20",
    status: "Pending"
  },
  {
    id: 2,
    title: "State Management",
    course: "Advanced React",
    dueDate: "2024-03-25",
    status: "Submitted"
  }
];

const Assignments = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Assignments</h1>
        <p className="text-muted-foreground">
          View and manage your course assignments
        </p>
      </div>

      <div className="grid gap-4">
        {mockAssignments.map((assignment) => (
          <Card key={assignment.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl">
                {assignment.title}
              </CardTitle>
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  Course: {assignment.course}
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Due: {assignment.dueDate}</span>
                </div>
                <span className={`text-sm font-medium ${
                  assignment.status === "Submitted" ? "text-green-500" : "text-yellow-500"
                }`}>
                  {assignment.status}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;