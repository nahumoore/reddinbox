"use client";

import { cn } from "@/lib/utils";
import { Icon } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarGroup, SidebarMenu, SidebarMenuButton } from "../ui/sidebar";

export interface LinkProps {
  title: string;
  url: string;
  icon?: Icon;
}

export function NavFooter({ links }: { links: LinkProps[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {links.map((item) => (
          <Link href={item.url} key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              className={cn(
                pathname === item.url
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "cursor-pointer hover:bg-sidebar-accent/30",
                "transition-all"
              )}
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
