"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProductDropdown from "@/components/productDropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);  //it is called as state
  return (
    <header className="bg-[#101820] text-white sticky top-0 z-50">
      <div className="bg-yellow-500 text-black text-center py-2 font-semibold">
        Trusted Industrial Fastening Solutions Since 1996
      </div>

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        <h1 className="text-4xl font-bold text-yellow-400">
          WE PRO INDUSTRIAL PRODUCTS
        </h1>

        <ul className="hidden md:flex gap-10 font-medium items-center">

          <li>
            <Link href="/">Home</Link>
          </li>

          <li className="relative">

         <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
          
          >
              Products ▼
            </button>

            

          {open && <ProductDropdown />}

          </li>

          <li>
            <Link href="/about">About</Link>
          </li>

          <li>
            <Link href="/contact">Contact</Link>
          </li>

        </ul>

        <button
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={30} /> : <Menu size={30} />}
      </button>

        <Link
         href="/#enquiry"
         className="hidden md:block bg-yellow-500 text-black px-5 py-2 rounded-lg font-semibold"
         >
          Get Quote
        </Link>


      {mobileOpen && (
  <div className="md:hidden bg-[#101820] border-t border-gray-700">
    <ul className="flex flex-col p-4 space-y-4">

      <li>
        <Link href="/" onClick={() => setMobileOpen(false)}>
          Home
        </Link>
      </li>

      <li>
        <Link
          href="/products?category=3"
          onClick={() => setMobileOpen(false)}
        >
          Products
        </Link>
      </li>

      <li>
        <Link href="/about" onClick={() => setMobileOpen(false)}>
          About
        </Link>
      </li>

      <li>
        <Link href="/#enquiry" onClick={() => setMobileOpen(false)}>
          Get Quote
        </Link>
      </li>

    </ul>
  </div>
)}


      </nav>
    </header>
  );
}