"use client";

import { stripeBuyPlanRedirect } from "@/actions/stripe-buy-plan-redirect";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabaseClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useUserInfo } from "@/stores/user-info";
import { IconCash, IconLoader2 } from "@tabler/icons-react";
import { ChevronsUpDown, LogOut, Sparkles } from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";

export function NavUser() {
  const { isMobile, open } = useSidebar();
  const { userInfo, isLoadingUserInfo } = useUserInfo();
  const [isLoadingUpgrade, setIsLoadingUpgrade] = useState(false);

  const handleLogout = () => {
    const supabase = supabaseClient();
    supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  const handleUpgrade = async () => {
    setIsLoadingUpgrade(true);
    const url = await stripeBuyPlanRedirect();

    if (url) {
      window.location.href = url;
    } else {
      setIsLoadingUpgrade(false);
    }
  };

  const getFreeTrialExpirationDate = () => {
    const freeTrialExpirationDate = new Date(
      userInfo?.subscription_period_end_at || ""
    );
    const daysUntilExpiration = Math.ceil(
      (freeTrialExpirationDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiration;
  };

  return (
    <SidebarMenu>
      {isLoadingUserInfo ? (
        <SidebarMenuButton>
          <IconLoader2 className="size-4 animate-spin" />
        </SidebarMenuButton>
      ) : (
        <SidebarMenuItem>
          <DropdownMenu>
            {userInfo?.subscription_status === "free-trial" && (
              <Badge
                onClick={handleUpgrade}
                variant="outline"
                className={cn(
                  "bg-yellow-100 text-yellow-800 border-yellow-500 hover:translate-y-[-1px] cursor-pointer transition-all duration-300",
                  isLoadingUpgrade && "opacity-50 cursor-not-allowed"
                )}
              >
                {open ? (
                  <>
                    Your free trial expires in {getFreeTrialExpirationDate()}{" "}
                    days
                  </>
                ) : (
                  <>
                    <IconCash className="size-4" />
                  </>
                )}
              </Badge>
            )}
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {userInfo?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userInfo?.name}</span>
                  <span className="truncate text-xs">{userInfo?.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {userInfo?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {userInfo?.name}
                    </span>
                    <span className="truncate text-xs">{userInfo?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={handleUpgrade}
                  disabled={isLoadingUpgrade}
                >
                  <Sparkles
                    className={cn(isLoadingUpgrade && "animate-spin")}
                  />
                  Upgrade to Pro
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
