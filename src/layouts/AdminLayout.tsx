import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/src/components/sidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/src/components/ui/sidebar";
import Header from "./components/Header";

export default function AdminLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />

      <SidebarInset>
        <Header />
        {/* CONTENT */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
