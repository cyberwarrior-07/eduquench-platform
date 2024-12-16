import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

export function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full min-h-[calc(100vh-4rem)]">
            <Sidebar 
              className="flex-shrink-0 bg-white border-r shadow-sm transition-all duration-300 ease-in-out" 
              collapsible="icon"
            >
              <SidebarContent>
                <StudentSidebar />
              </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex-1 p-4 md:p-6 bg-gray-50 transition-all duration-300 ease-in-out">
              <div className="container mx-auto max-w-7xl">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Footer />
    </div>
  );
}