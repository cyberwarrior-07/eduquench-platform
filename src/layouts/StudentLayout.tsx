import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

export function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SidebarProvider defaultOpen={true}>
        <div className="flex-1 flex">
          <Sidebar 
            className="border-r border-gray-200 bg-white shadow-sm" 
            collapsible="icon"
          >
            <SidebarContent>
              <StudentSidebar />
            </SidebarContent>
          </Sidebar>
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