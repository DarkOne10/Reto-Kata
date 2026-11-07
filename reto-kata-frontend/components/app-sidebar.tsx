"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  FilePenLineIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  Settings2Icon,
  CommandIcon,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const navMain = user?.role === "APPLICANT"
    ? [
        { title: "Mi panel", url: "/application/follow-up", icon: <LayoutDashboardIcon /> },
        { title: "Nueva postulación", url: "/application", icon: <FilePenLineIcon /> },
      ]
    : [
        { title: "Panel", url: "/dashboard", icon: <LayoutDashboardIcon /> },
        { title: "Solicitudes", url: "/requests", icon: <ListChecksIcon /> },
      ]
  const navSecondary = user?.role === "ADMIN"
    ? [{ title: "Usuarios y permisos", url: "/settings", icon: <Settings2Icon /> }]
    : []

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<Link href={user?.role === "APPLICANT" ? "/application/follow-up" : "/dashboard"} />}
            >
              <CommandIcon className="size-5!" />
              <span className="text-base font-semibold">Reto-Kata</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {navSecondary.length > 0 && (
          <NavSecondary items={navSecondary} className="mt-auto" />
        )}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}
