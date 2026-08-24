"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function SiteChrome() {
  const pathname = usePathname();

  // Never show the public website navigation/components
  // anywhere inside the admin section.
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      <FloatingWhatsApp />
    </>
  );
}