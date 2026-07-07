"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ProductDropdown from "@/components/productDropdown";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);  //it is called as state
  return (
    <header className="bg-secondary text-white sticky top-0 z-50">
      <div className="bg-primary text-black text-center py-2 font-semibold">
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

        <li className="relative group">

          <button
            type="button"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            Products ▼
          </button>

          <div className="absolute left-0 top-full hidden group-hover:block z-50">
            <ProductDropdown />
          </div>

        </li>

          <li>
            <Link href="/">About</Link>
          </li>

          <li>
            <Link href="/#enquiry">Contact</Link>
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
         className="hidden md:block bg-primary text-black px-5 py-2 rounded-lg font-semibold"
         >
          Get Quote
        </Link>


      {mobileOpen && (
  <div className="md:hidden bg-secondary border-t border-gray-700">
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
        <Link href="/#" onClick={() => setMobileOpen(false)}>
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