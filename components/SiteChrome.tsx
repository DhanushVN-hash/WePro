"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

export default function SiteChrome() {
  const pathname = usePathname();

  // Never show the public website navigation/components
  // on login or anywhere inside the admin section.
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === "/login";

  if (isAdminRoute || isLoginRoute) {
    return null;
  }

  return (
    <>
      <Navbar />
      <FloatingWhatsApp />
    </>
  );
}