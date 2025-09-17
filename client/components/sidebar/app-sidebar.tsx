"use client";

import { GalleryVerticalEnd } from "lucide-react";
import * as React from "react";

import { LinkProps, NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { IconInbox, IconUser, IconUsers } from "@tabler/icons-react";
import { NavFooter } from "./nav-footer";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      section: "Outreach",
      items: [
        {
          title: "Lead Discovery",
          icon: IconUsers,
          url: "/dashboard/lead-discovery",
        },
        {
          title: "Inbox",
          icon: IconInbox,
          url: "/dashboard/inbox",
        },
      ],
    },
  ],
  navFooter: [
    {
      title: "Reddit Profile",
      icon: IconUser,
      url: "/dashboard/reddit-profile",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain links={data.navMain as LinkProps[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter links={data.navFooter} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
