"use client";
import { Header } from "@/components/header";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div>
        <Header />
        <main>{children}</main>
      </div>
    </SessionProvider>
  );
}
