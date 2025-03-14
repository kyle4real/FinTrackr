"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

export function DashboardLink() {
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <Button asChild variant="ghost">
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}
