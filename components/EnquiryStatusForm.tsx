"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  id: number;
  currentStatus: string;
};

export default function EnquiryStatusForm({
  id,
  currentStatus,
}: Props) {
  const supabase = createClient();
  const router = useRouter();

  const [status, setStatus] =
    useState(currentStatus);

  const [saving, setSaving] =
    useState(false);

  async function updateStatus(
    value: string
  ) {
    setStatus(value);
    setSaving(true);

    const { error } =
      await supabase
        .from("enquiries")
        .update({
          status: value,
        })
        .eq("id", id);

    if (error) {
      alert(
        "Unable to update status: " +
          error.message
      );

      setStatus(
        currentStatus
      );

      setSaving(false);
      return;
    }

    setSaving(false);

    router.refresh();
  }

  return (
    <div>

      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
        Current Status
      </label>

      <select
        value={status}
        disabled={saving}
        onChange={(e) =>
          updateStatus(
            e.target.value
          )
        }
        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none transition focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-60"
      >

        <option value="New">
          New
        </option>

        <option value="Contacted">
          Contacted
        </option>

        <option value="Quotation Sent">
          Quotation Sent
        </option>

        <option value="Follow Up">
          Follow Up
        </option>

        <option value="Closed">
          Closed
        </option>

      </select>

      <p className="mt-2 text-xs text-slate-400">
        {saving
          ? "Saving status..."
          : "Status is saved automatically."}
      </p>

    </div>
  );
}