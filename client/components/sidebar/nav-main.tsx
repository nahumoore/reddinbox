"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export interface LinkProps {
  section: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
}

export function NavMain({ links }: { links: LinkProps[] }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {links.map((link) => (
          <SidebarMenuItem key={link.section}>
            <SidebarGroupLabel>{link.section}</SidebarGroupLabel>
            {link.items.map((item) => (
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
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
