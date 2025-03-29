"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ChartArea, CreditCard, Landmark } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: ChartArea,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Linked Accounts",
    href: "/dashboard/accounts",
    icon: Landmark,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="top-[var(--header-height)] !h-[calc(100svh-var(--header-height))]">
      <SidebarHeader />
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.href}>
                <Link href={item.href}>
                  {<item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <footer className="p-2 text-center">
          <p className="text-xs text-muted-foreground">
            This is a sandbox application built for demonstration purposes only. Data shown is not real and should not
            be used for financial decision-making.
          </p>
        </footer>
      </SidebarFooter>
    </Sidebar>
  );
}
