import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FinTrackr",
  description: "FinTrackr is a personal finance tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={
          {
            "--header-height": "64px",
          } as React.CSSProperties
        }
        className={cn(fontSans.className, fontSans.variable, `antialiased`)}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
