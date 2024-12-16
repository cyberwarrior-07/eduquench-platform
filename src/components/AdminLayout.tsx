import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      <div className={`fixed h-full transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
        <AdminSidebar />
        <div className="fixed left-64 top-1/2 -translate-y-1/2 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-6 bg-white border shadow-sm hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {children}
      </main>
    </div>
  );
}