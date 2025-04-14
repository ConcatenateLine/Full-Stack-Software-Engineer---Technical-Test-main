import { Command } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NavMain, { NavMainItemProps } from "./NavMain";
import NavProjects, { NavProjectsItemProps } from "./NavProjects";
import NavSecondary, { NavSecondaryItemProps } from "./NavSecondary";
import NavUser from "./NavUser";
import { data as sidebarData } from "../constants/SidebarItems";
import { ComponentProps } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import {
  FilterByCredentials,
  MenuItemWithCredentials,
} from "../utils/FilterByCredentials";

const DashboardSidebar = ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const data = {
    navMain: FilterByCredentials(
      sidebarData.navMain as MenuItemWithCredentials[],
      user?.role?.permissions
    ),
    navSecondary: FilterByCredentials(
      sidebarData.navSecondary as MenuItemWithCredentials[],
      user?.role?.permissions
    ),
    projects: FilterByCredentials(
      sidebarData.projects as MenuItemWithCredentials[],
      user?.role?.permissions
    ),
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">{user?.role?.label}</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain as NavMainItemProps[]} />
        <NavProjects projects={data.projects as NavProjectsItemProps[]} />
        <NavSecondary
          items={data.navSecondary as NavSecondaryItemProps[]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
