"use client"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { IconCreditCard, IconDashboard, IconPlus, IconTextPlus } from '@tabler/icons-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const ITEMS = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: IconTextPlus
  },
  {
    title: "Billing",
    url: "/billing",
    icon: IconCreditCard
  }
]

const ICON_SIZE = "size-4"

const PROJECT = [
  {
    name: 'Project 1'
  },
  {
    name: 'Project 2'
  },
]

const AppSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarHeader>
        Logo
      </SidebarHeader>
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
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {PROJECT.map((proj) => {
                return (
                  <SidebarMenuItem key={proj.name}>
                    <SidebarMenuButton asChild>
                      <div>
                        <div className={cn(
                          'rounded-sm border flex items-center justify-center text-sm bg-white text-primary flex-shrink-0',
                          ICON_SIZE,
                          {
                            'bg-primary text-white': false
                          }
                        )}>
                          {proj.name[0]}
                        </div>
                        <span>{proj.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}

              <div className='h-2' />

              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href='/create'>
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
  )
}

export default AppSidebar
