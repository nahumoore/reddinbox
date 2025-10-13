"use client";

import * as React from "react";

import { LinkProps, NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconHeartHandshake,
  IconNews,
  IconUser,
  IconUsersGroup,
  IconUserUp,
} from "@tabler/icons-react";
import { BrandReddinbox } from "../icons/BrandReddinbox";
import { NavFooter } from "./nav-footer";
import { WebsiteSwitcher } from "./website-switcher";

const data = {
  navMain: [
    {
      section: "Platform",
      items: [
        {
          title: "Authority Feed",
          icon: IconUserUp,
          url: "/dashboard/authority-feed",
        },
        {
          title: "Relationship Pipeline",
          icon: IconHeartHandshake,
          url: "/dashboard/relationship-pipeline",
        },
        {
          title: "Posts Builder",
          icon: IconNews,
          url: "/dashboard/posts-builder",
        },
      ],
    },
  ],
  navFooter: [
    {
      title: "Tracking Subreddits",
      icon: IconUsersGroup,
      url: "/dashboard/tracking-subreddits",
    },
    {
      title: "Reddit Profile",
      icon: IconUser,
      url: "/dashboard/reddit-profile",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="px-2 mb-2">
          <div className="flex items-center gap-2">
            <BrandReddinbox className="size-6 text-primary" />
            {open && (
              <span className="font-medium text-xl text-primary mt-1">
                Reddinbox
              </span>
            )}
          </div>
        </div>
        <WebsiteSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain links={data.navMain as LinkProps[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter links={data.navFooter} />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
