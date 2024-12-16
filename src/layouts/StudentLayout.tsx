import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function StudentLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SidebarProvider defaultOpen={true}>
        <div className="flex-1 flex">
          <div className={cn(
            "relative border-r border-gray-200 bg-white shadow-sm transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64"
          )}>
            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-20">
              <Button
                variant="outline"
                size="sm"
                className="flex h-6 w-6 items-center justify-center rounded-full p-0 shadow-md bg-white"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                <ChevronLeft
                  className={cn(
                    "h-4 w-4 transition-transform duration-300",
                    isCollapsed ? "rotate-180" : "rotate-0"
                  )}
                />
              </Button>
            </div>
            <SidebarContent>
              <StudentSidebar isCollapsed={isCollapsed} />
            </SidebarContent>
          </div>
          <SidebarInset className="flex-1 bg-gray-50 overflow-y-auto">
            <div className="min-h-[calc(100vh-4rem)]">
              <Outlet />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <Footer />
    </div>
  );
}