import { Card } from "@/components/ui/card";

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage your users
        </p>
      </div>
      <Card className="p-6">
        <p>User management coming soon...</p>
      </Card>
    </div>
  );
}