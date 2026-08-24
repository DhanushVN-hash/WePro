"use client";

import { useState } from "react";

interface SpecRow {
  label: string;
  value?: string;
  multiline?: boolean;
}

export default function SpecPanel({ rows }: { rows: SpecRow[] }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="mt-10 sm:mt-12">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between bg-[#101820] text-white px-4 py-3"
      >
        <span className="text-sm sm:text-base font-bold uppercase tracking-widest">
          Specifications
        </span>
        <span className="text-[#F4C300] text-lg leading-none">
          {open ? "–" : "+"}
        </span>
      </button>

      {open && (
        <dl className="border border-[#101820]/15 border-t-0 divide-y divide-[#101820]/10">
          {rows.map(({ label, value, multiline }) => (
            <div
              key={label}
              className="grid grid-cols-1 sm:grid-cols-3 odd:bg-gray-50"
            >
              <dt className="px-4 py-3 sm:py-3.5 font-semibold text-[#101820] text-sm sm:border-r sm:border-[#101820]/10">
                {label}
              </dt>
              <dd
                className={`px-4 py-3 sm:py-3.5 sm:col-span-2 font-mono text-sm text-gray-700 ${
                  multiline ? "whitespace-pre-line" : ""
                }`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}