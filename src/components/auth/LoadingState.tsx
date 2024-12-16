import { Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-sm">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="text-muted-foreground font-medium">Loading...</span>
    </div>
  </div>
);