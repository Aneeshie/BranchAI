"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import {
  IconCreditCard,
  IconDashboard,
  IconPlus,
  IconTextPlus,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: IconTextPlus,
  },
  {
    title: "Billing",
    url: "/billing",
    icon: IconCreditCard,
  },
];

const ICON_SIZE = "size-4";

const AppSidebar = () => {
  const pathname = usePathname();

  const { projects, selectedProjectId, setSelectedProjectId } = useProject();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>Logo</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => {
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon className={ICON_SIZE} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects?.map((proj) => {
                return (
                  <SidebarMenuItem key={proj.name}>
                    <SidebarMenuButton asChild>
                      <div
                        onClick={() => {
                          setSelectedProjectId(proj.id);
                        }}
                      >
                        <div
                          className={cn(
                            "text-primary flex shrink-0 items-center justify-center rounded-sm border bg-white text-sm",
                            ICON_SIZE,
                            {
                              "bg-primary text-white":
                                proj.id === selectedProjectId,
                            },
                          )}
                        >
                          {proj.name[0]}
                        </div>
                        <span>{proj.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <div className="h-2" />

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/create">
                    <IconPlus className={ICON_SIZE} />
                    <span>Create Project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
