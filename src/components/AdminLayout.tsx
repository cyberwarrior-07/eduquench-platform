import { Sidebar, SidebarContent, SidebarInset, SidebarProvider } from "./ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen">
          <Sidebar className="border-r bg-background" collapsible="icon">
            <SidebarContent>
              <AdminSidebar />
            </SidebarContent>
          </Sidebar>
          <SidebarInset className="flex-1 overflow-auto">
            <div className="container max-w-7xl py-6">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}