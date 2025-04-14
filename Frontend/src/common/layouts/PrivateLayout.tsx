import { Outlet } from "react-router";
import PrivateRoute from "../components/PrivateRoute";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "../components/DashboardSidebar";
import { Toaster } from "sonner";
import SiteHeader from "../components/SiteHeader";

const PrivateLayout = () => {
  return (
    <PrivateRoute>
      <SidebarProvider>
        <DashboardSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col bg-[var(--background)]">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <Outlet />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </PrivateRoute>
  );
};

export default PrivateLayout;
