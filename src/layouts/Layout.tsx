import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layouts/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@dscn/components/ui/sidebar";
import Header from "./components/Header";

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="flex flex-col h-screen w-full overflow-hidden">
        <div className="shrink-0">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
