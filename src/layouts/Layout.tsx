import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/layouts/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@dscn/components/ui/sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function Layout() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen w-full p-0 m-0">
        <div className="sticky top-0 z-40">
          <Header />
        </div>

        <div className="overflow-y-auto">
          <Outlet />
          <Footer />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
