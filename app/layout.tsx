import NextTopLoader from "nextjs-toploader";
import type { Metadata,Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WE PRO Industrial Products",
  description: "Industrial Pneumatic Tools & Fasteners",
};


export const viewport: Viewport = {
  themeColor: "#101820",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
    <NextTopLoader
        color="#ef4444"
        height={6}
        showSpinner={false}
        shadow="0 0 15px #f97316"
        easing="ease"
        speed={250}
    />

        <Navbar />
        
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}