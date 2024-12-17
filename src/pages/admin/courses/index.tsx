import { Card } from "@/components/ui/card";

export default function AdminCourses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Courses</h1>
        <p className="text-sm text-muted-foreground">
          Manage your courses
        </p>
      </div>
      <Card className="p-6">
        <p>Courses management coming soon...</p>
      </Card>
    </div>
  );
}