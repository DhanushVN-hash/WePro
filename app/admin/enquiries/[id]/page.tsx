import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import EnquiryStatusForm from "@/components/EnquiryStatusForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EnquiryDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: enquiry, error } =
    await supabase
      .from("enquiries")
      .select("*")
      .eq("id", id)
      .single();

  if (error || !enquiry) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] p-6 sm:p-10">
        <div className="mx-auto max-w-4xl">

          <Link
            href="/admin/enquiries"
            className="text-sm font-semibold text-slate-500 hover:text-slate-900"
          >
            ← Back to Enquiries
          </Link>

          <div className="mt-6 rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">

            <h1 className="text-xl font-bold text-[#101820]">
              Enquiry not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              This enquiry may have been deleted or
              does not exist.
            </p>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* =====================================================
          HEADER
          ===================================================== */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-6xl px-5 py-6 sm:px-7">

          <Link
            href="/admin/enquiries"
            className="inline-flex items-center text-sm font-semibold text-slate-500 transition hover:text-[#101820]"
          >
            ← Back to Enquiries
          </Link>

          <div className="mt-5">

            <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              Customer Enquiry
            </p>

            <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h1 className="text-3xl font-black tracking-tight text-[#101820]">
                  Enquiry #
                  {String(
                    enquiry.id
                  ).padStart(4, "0")}
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Submitted{" "}
                  {formatDate(
                    enquiry.created_at
                  )}{" "}
                  at{" "}
                  {formatTime(
                    enquiry.created_at
                  )}
                </p>

              </div>

              <StatusBadge
                status={
                  enquiry.status
                }
              />

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN
          ===================================================== */}

      <main className="mx-auto max-w-6xl px-5 py-7 sm:px-7">

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* =================================================
              LEFT
              ================================================= */}

          <div className="space-y-6">

            {/* CUSTOMER */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Customer
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#101820]">
                  Customer Information
                </h2>

              </div>

              <div className="grid gap-6 p-6 sm:grid-cols-2">

                <InfoItem
                  label="Name"
                  value={
                    enquiry.name ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="Phone"
                  value={
                    enquiry.phone ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="Email"
                  value={
                    enquiry.email ||
                    "Not provided"
                  }
                />

                <InfoItem
                  label="Enquiry ID"
                  value={`ENQ-${String(
                    enquiry.id
                  ).padStart(
                    4,
                    "0"
                  )}`}
                />

              </div>

            </section>

            {/* ENQUIRY */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Enquiry
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#101820]">
                  Customer Request
                </h2>

              </div>

              <div className="space-y-6 p-6">

                <InfoItem
                  label="Product"
                  value={
                    enquiry.product ||
                    "General Enquiry"
                  }
                />

                <div>

                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Message
                  </p>

                  <div className="rounded-xl bg-slate-50 p-5">

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">
                      {enquiry.message ||
                        "No message provided."}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* CUSTOMER ACTIONS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#101820]">
                  Customer Actions
                </h2>

              </div>

              <div className="grid gap-3 p-6 sm:grid-cols-3">

                {enquiry.phone && (
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#101820] px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
                  >
                    <PhoneIcon />
                    Call
                  </a>
                )}

                {enquiry.phone && (
                  <a
                    href={`https://wa.me/${enquiry.phone.replace(
                      /\D/g,
                      ""
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-700"
                  >
                    <WhatsAppIcon />
                    WhatsApp
                  </a>
                )}

                {enquiry.email && (
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  >
                    <MailIcon />
                    Email
                  </a>
                )}

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
              ================================================= */}

          <aside className="space-y-6">

            {/* STATUS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Workflow
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#101820]">
                  Enquiry Status
                </h2>

              </div>

              <div className="p-5">

                <EnquiryStatusForm
                  id={enquiry.id}
                  currentStatus={
                    enquiry.status ||
                    "New"
                  }
                />

              </div>

            </section>

            {/* DETAILS */}

            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-5 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#101820]">
                  Enquiry Details
                </h2>

              </div>

              <div className="space-y-4 p-5">

                <InfoItem
                  label="Submitted"
                  value={formatDate(
                    enquiry.created_at
                  )}
                />

                <InfoItem
                  label="Time"
                  value={formatTime(
                    enquiry.created_at
                  )}
                />

                <InfoItem
                  label="Product"
                  value={
                    enquiry.product ||
                    "General"
                  }
                />

                <InfoItem
                  label="Status"
                  value={
                    enquiry.status ||
                    "New"
                  }
                />

              </div>

            </section>

          </aside>

        </div>

      </main>

    </div>
  );
}

/*
 * ==========================================================
 * INFO ITEM
 * ==========================================================
 */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}

/*
 * ==========================================================
 * STATUS BADGE
 * ==========================================================
 */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const styles: Record<
    string,
    string
  > = {
    New:
      "bg-blue-50 text-blue-700 ring-blue-600/10",

    Contacted:
      "bg-yellow-50 text-yellow-700 ring-yellow-600/10",

    "Quotation Sent":
      "bg-purple-50 text-purple-700 ring-purple-600/10",

    "Follow Up":
      "bg-orange-50 text-orange-700 ring-orange-600/10",

    Closed:
      "bg-green-50 text-green-700 ring-green-600/10",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${
        styles[status] ||
        "bg-slate-50 text-slate-600 ring-slate-500/10"
      }`}
    >

      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {status}

    </span>
  );
}

/*
 * ==========================================================
 * DATE / TIME
 * ==========================================================
 */

function formatDate(
  value: string
) {
  return new Date(
    value
  ).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

function formatTime(
  value: string
) {
  return new Date(
    value
  ).toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}

/*
 * ==========================================================
 * ICONS
 * ==========================================================
 */

function PhoneIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.7 7.4L4 20l1.2-3.7A8.5 8.5 0 1 1 20.5 11.5Z" />

      <path d="M8.5 8.5c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.5.6c-.1.1-.2.3-.1.5.4.7 1 1.3 1.7 1.7.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.7-.1l1.6.8c.3.1.4.3.4.5v.5c0 .3-.1.6-.5.9-.4.3-1 .4-1.5.2-1-.3-2.1-.9-3.1-1.8-1-.9-1.7-2-2-3-.2-.5-.1-1.1.2-1.5Z" />
    </svg>
  );
}