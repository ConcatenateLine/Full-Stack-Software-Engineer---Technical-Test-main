import {
  Frame,
  LayoutDashboardIcon,
  UsersIcon,
  LifeBuoy,
  Send,
} from "lucide-react";
import { CredentialsEnum } from "../enums/CredentialsEnum";

export const data = {
  user: {
    name: "Managing Users",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
      credentials: [CredentialsEnum["application:all"]],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: UsersIcon,
      credentials: [CredentialsEnum["user:read"]],
      items: [
        {
          title: "List Users",
          url: "/dashboard/users",
          credentials: [CredentialsEnum["user:read"]],
        },
        {
          title: "Add User",
          url: "/dashboard/users/add",
          credentials: [CredentialsEnum["user:create"]],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Example",
      url: "#",
      icon: LifeBuoy,
      credentials: [CredentialsEnum["model:read"]],
    },
    {
      title: "Example",
      url: "#",
      icon: Send,
      credentials: [CredentialsEnum["model:read"]],
    },
  ],
  projects: [
    {
      name: "Example menu",
      url: "#",
      icon: Frame,
      credentials: [CredentialsEnum["project:read"]],
    },
  ],
};
