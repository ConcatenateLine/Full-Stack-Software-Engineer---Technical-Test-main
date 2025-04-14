import {
  BookOpen,
  Bot,
  Frame,
  LayoutDashboardIcon,
  UsersIcon,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
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
    {
      title: "Models",
      url: "#",
      icon: Bot,
      credentials: [CredentialsEnum["model:read"]],
      items: [
        {
          title: "Genesis",
          url: "#",
          credentials: [CredentialsEnum["model:read"]],
        },
        {
          title: "Explorer",
          url: "#",
          credentials: [CredentialsEnum["model:read"]],
        },
        {
          title: "Quantum",
          url: "#",
          credentials: [CredentialsEnum["model:read"]],
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      credentials: [CredentialsEnum["application:all"]],
      items: [
        {
          title: "Introduction",
          url: "#",
          credentials: [CredentialsEnum["application:all"]],
        },
        {
          title: "Get Started",
          url: "#",
          credentials: [CredentialsEnum["application:all"]],
        },
        {
          title: "Tutorials",
          url: "#",
          credentials: [CredentialsEnum["application:all"]],
        },
        {
          title: "Changelog",
          url: "#",
          credentials: [CredentialsEnum["application:all"]],
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      credentials: [CredentialsEnum["settings:read"]],
      items: [
        {
          title: "General",
          url: "#",
          credentials: [CredentialsEnum["settings:read"]],
        },
        {
          title: "Team",
          url: "#",
          credentials: [CredentialsEnum["settings:read"]],
        },
        {
          title: "Billing",
          url: "#",
          credentials: [CredentialsEnum["settings:read"]],
        },
        {
          title: "Limits",
          url: "#",
          credentials: [CredentialsEnum["settings:read"]],
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
      credentials: [CredentialsEnum["model:read"]],
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
      credentials: [CredentialsEnum["model:read"]],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
      credentials: [CredentialsEnum["project:read"]],
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
      credentials: [CredentialsEnum["project:read"]],
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
      credentials: [CredentialsEnum["project:read"]],
    },
  ],
};
