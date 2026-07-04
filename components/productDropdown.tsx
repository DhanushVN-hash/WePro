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
    <div className="absolute top-full left-0 mt-2 w-[360px] bg-[#6c6c6c] rounded-md shadow-2xl z-50">
      <ul className="py-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={`/products?category=${item.id}`}
              className="block w-full px-6 py-4 text-yellow-400 hover:bg-[#555]"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}