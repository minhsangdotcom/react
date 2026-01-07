import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layouts/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@dscn/components/ui/sidebar";
import Header from "./components/Header";

export default function AdminLayout() {
  return (
    <SidebarProvider defaultOpen = {false}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
