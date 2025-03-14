import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { Header } from "@/components/header";
import { DashboardSidebar } from "./sidebar";
import { auth } from "@/auth";
import { redirect, RedirectType } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return redirect("/", RedirectType.replace);
  }

  return (
    <div className="min-h-screen">
      <SidebarProvider className={`flex flex-col`}>
        <Header leftActions={<SidebarTrigger />} />
        <div className="flex flex-1">
          <DashboardSidebar />

          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
