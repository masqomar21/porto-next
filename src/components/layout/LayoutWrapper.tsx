"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutWrapper({
  children,
  navbarData,
  contactData,
}: {
  children: React.ReactNode;
  navbarData: any;
  contactData: any;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar navbarData={navbarData} />
      <main className="flex-1">{children}</main>
      <Footer contactData={contactData} />
    </>
  );
}
