import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/StudentSidebar";

export function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <SidebarProvider defaultOpen={true}>
          <div className="flex w-full">
            <Sidebar className="flex-shrink-0 bg-white border-r" collapsible="icon">
              <SidebarContent>
                <StudentSidebar />
              </SidebarContent>
            </Sidebar>
            <SidebarInset className="flex-1 p-4 md:p-6 w-full overflow-x-hidden bg-white">
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