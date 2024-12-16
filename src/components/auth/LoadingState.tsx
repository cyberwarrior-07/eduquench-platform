import { Loader2 } from "lucide-react";

export const LoadingState = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-sm">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <div className="space-y-2 text-center">
        <span className="text-lg font-medium">Loading...</span>
        <p className="text-sm text-muted-foreground">Please wait while we check your authentication status</p>
      </div>
    </div>
  </div>
);