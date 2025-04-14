import { ComponentPropsWithoutRef } from "react";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { CredentialsEnum } from "../enums/CredentialsEnum";

export interface NavSecondaryItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  credentials?: CredentialsEnum[];
}

export interface NavSecondaryProps {
  items: NavSecondaryItemProps[];
}

const NavSecondary = ({
  items,
  ...props
}: NavSecondaryProps & ComponentPropsWithoutRef<typeof SidebarGroup>) => {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <Link to={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavSecondary;
