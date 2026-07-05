"use client";

import Link from "next/link";

const items = [
  { id: 3, name: "Pneumatic Nailers & Staplers" },
  { id: 4, name: "Fasteners" },
  { id: 5, name: "Spray Guns" },
  { id: 6, name: "Pneumatic Tools" },
  { id: 7, name: "Accessory & Others" },
];

export default function ProductDropdown() {
  return (
    <div className="mt-3 w-80 overflow-hidden rounded-xl border border-yellow-500/20 bg-secondary shadow-2xl">

      <ul className="py-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/products?category=${item.id}`}
              className="flex items-center justify-between px-6 py-4 text-gray-200 transition-all duration-200 hover:bg-primary hover:text-black hover:pl-8"
            >
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}