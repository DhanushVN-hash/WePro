import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 10;

type Enquiry = {
  id: number;
  name: string | null;
  phone: string | null;
  email: string | null;
  product: string | null;
  message: string | null;
  status: string | null;
  created_at: string;
};

export default async function EnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const supabase = await createClient();

  const {
    q,
    status,
    page,
  } = await searchParams;

  /*
   * ==========================================================
   * PAGINATION
   * ==========================================================
   */

  const currentPage = Math.max(
    1,
    Number(page) || 1
  );

  const from =
    (currentPage - 1) * PAGE_SIZE;

  const to =
    from + PAGE_SIZE - 1;

  /*
   * ==========================================================
   * ENQUIRIES QUERY
   * ==========================================================
   */

  let query = supabase
    .from("enquiries")
    .select("*", {
      count: "exact",
    })
    .order("created_at", {
      ascending: false,
    });

  /*
   * SEARCH
   */

  if (q?.trim()) {
    const search = q.trim();

    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%,product.ilike.%${search}%`
    );
  }

  /*
   * STATUS FILTER
   */

  if (status) {
    query = query.eq(
      "status",
      status
    );
  }

  /*
   * ONLY 10 RECORDS
   */

  query = query.range(
    from,
    to
  );

  const {
    data,
    error,
    count,
  } = await query;

  if (error) {
    console.error(
      "Failed to load enquiries:",
      error.message
    );
  }

  const enquiries: Enquiry[] =
    data || [];

  const totalCount =
    count ?? 0;

  const totalPages = Math.max(
    1,
    Math.ceil(
      totalCount / PAGE_SIZE
    )
  );

  /*
   * ==========================================================
   * STATISTICS
   * ==========================================================
   */

  const { count: newCount } =
    await supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "New");

  const { count: contactedCount } =
    await supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "Contacted");

  const { count: quotationCount } =
    await supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "Quotation Sent"
      );

  const hasFilters =
    Boolean(q || status);

  /*
   * ==========================================================
   * PAGINATION URL
   * ==========================================================
   */

  const buildPageHref = (
    targetPage: number
  ) => {
    const params =
      new URLSearchParams();

    if (q) {
      params.set(
        "q",
        q
      );
    }

    if (status) {
      params.set(
        "status",
        status
      );
    }

    if (targetPage > 1) {
      params.set(
        "page",
        String(targetPage)
      );
    }

    const queryString =
      params.toString();

    return queryString
      ? `/admin/enquiries?${queryString}`
      : "/admin/enquiries";
  };

  /*
   * ==========================================================
   * DISPLAY RANGE
   * ==========================================================
   */

  const displayFrom =
    totalCount === 0
      ? 0
      : from + 1;

  const displayTo =
    Math.min(
      to + 1,
      totalCount
    );

  /*
   * ==========================================================
   * PAGE
   * ==========================================================
   */

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-[1600px] px-5 py-7 sm:px-7 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
                Customer Management
              </p>

              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#101820] sm:text-4xl">
                Enquiries
              </h1>

              <p className="mt-2 text-sm text-slate-500 sm:text-base">
                Manage customer enquiries and
                follow up with potential customers.
              </p>

            </div>

            <Link
              href="/admin/enquiries"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-[#101820] shadow-sm transition hover:bg-slate-50"
            >
              Refresh
            </Link>

          </div>

        </div>

      </div>

      {/* ======================================================
          MAIN
          ====================================================== */}

      <main className="mx-auto max-w-[1600px] px-5 py-7 sm:px-7 lg:px-8">

        {/* ====================================================
            STATISTICS
            ==================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            label="Total Enquiries"
            value={totalCount}
            description="All customer enquiries"
            type="total"
          />

          <StatCard
            label="New"
            value={newCount ?? 0}
            description="Waiting for response"
            type="new"
          />

          <StatCard
            label="Contacted"
            value={contactedCount ?? 0}
            description="Customers contacted"
            type="contacted"
          />

          <StatCard
            label="Quotation Sent"
            value={quotationCount ?? 0}
            description="Quotation provided"
            type="quotation"
          />

        </div>

        {/* ====================================================
            FILTERS
            ==================================================== */}

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <form
            action="/admin/enquiries"
            className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_auto_auto]"
          >

            {/* SEARCH */}

            <div className="relative">

              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <SearchIcon />
              </div>

              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search name, email, phone or product..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-200"
              />

            </div>

            {/* STATUS */}

            <select
              name="status"
              defaultValue={
                status || ""
              }
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            >

              <option value="">
                All Statuses
              </option>

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

            {/* APPLY */}

            <button
              type="submit"
              className="h-11 rounded-xl bg-[#101820] px-5 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              Apply
            </button>

            {/* CLEAR */}

            {hasFilters ? (

              <Link
                href="/admin/enquiries"
                className="flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </Link>

            ) : (

              <div className="hidden lg:block" />

            )}

          </form>

        </section>

        {/* ====================================================
            TABLE
            ==================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* TABLE HEADER */}

          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="font-bold text-[#101820]">
                Customer Enquiries
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">

                Showing{" "}
                <span className="font-semibold">
                  {displayFrom}
                </span>

                {" – "}

                <span className="font-semibold">
                  {displayTo}
                </span>

                {" of "}

                <span className="font-semibold">
                  {totalCount}
                </span>

                {" enquiries"}

              </p>

            </div>

            <div className="flex items-center gap-2">

              {hasFilters && (
                <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                  Filtered results
                </span>
              )}

              <span className="inline-flex rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                10 per page
              </span>

            </div>

          </div>

          {enquiries.length === 0 ? (

            <EmptyState
              hasFilters={
                hasFilters
              }
            />

          ) : (

            <>

              {/* =================================================
                  TABLE
                  ================================================= */}

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50 text-left">

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Enquiry
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Contact
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Product
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {enquiries.map(
                      (enquiry) => (
                        <EnquiryRow
                          key={
                            enquiry.id
                          }
                          enquiry={
                            enquiry
                          }
                        />
                      )
                    )}

                  </tbody>

                </table>

              </div>

              {/* =================================================
                  PAGINATION
                  ================================================= */}

              <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                {/* RANGE */}

                <p className="text-sm text-slate-500">

                  Showing{" "}

                  <span className="font-semibold text-slate-700">
                    {displayFrom}
                  </span>

                  {" – "}

                  <span className="font-semibold text-slate-700">
                    {displayTo}
                  </span>

                  {" of "}

                  <span className="font-semibold text-slate-700">
                    {totalCount}
                  </span>

                  {" enquiries"}

                </p>

                {/* BUTTONS */}

                <div className="flex items-center gap-2">

                  <Link
                    href={buildPageHref(
                      currentPage -
                        1
                    )}
                    aria-disabled={
                      currentPage <=
                      1
                    }
                    className={`inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold transition ${
                      currentPage <= 1
                        ? "pointer-events-none border-slate-100 text-slate-300"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    ← Previous
                  </Link>

                  <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg bg-[#101820] px-3 text-sm font-bold text-white">
                    {currentPage}
                  </span>

                  <Link
                    href={buildPageHref(
                      currentPage +
                        1
                    )}
                    aria-disabled={
                      currentPage >=
                      totalPages
                    }
                    className={`inline-flex h-10 items-center rounded-lg border px-4 text-sm font-semibold transition ${
                      currentPage >=
                      totalPages
                        ? "pointer-events-none border-slate-100 text-slate-300"
                        : "border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Next →
                  </Link>

                </div>

              </div>

            </>

          )}

        </section>

      </main>

    </div>
  );
}

/*
 * ==========================================================
 * ENQUIRY ROW
 * ==========================================================
 */

function EnquiryRow({
  enquiry,
}: {
  enquiry: Enquiry;
}) {
  return (
    <tr className="border-b border-slate-100 transition hover:bg-slate-50/70">

      {/* ENQUIRY ID */}

      <td className="px-5 py-4">

        <span className="font-mono text-xs font-bold text-slate-500">
          ENQ-
          {String(
            enquiry.id
          ).padStart(4, "0")}
        </span>

      </td>

      {/* CUSTOMER */}

      <td className="px-5 py-4">

        <div className="max-w-[210px]">

          <p className="truncate text-sm font-bold text-[#101820]">
            {enquiry.name ||
              "Unknown Customer"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-400">
            {enquiry.email ||
              "No email provided"}
          </p>

        </div>

      </td>

      {/* CONTACT */}

      <td className="px-5 py-4">

        <div>

          <p className="text-sm font-medium text-slate-700">
            {enquiry.phone ||
              "No phone"}
          </p>

          {enquiry.email && (
            <p className="mt-1 max-w-[190px] truncate text-xs text-slate-400">
              {enquiry.email}
            </p>
          )}

        </div>

      </td>

      {/* PRODUCT */}

      <td className="px-5 py-4">

        <div className="max-w-[220px]">

          <p className="truncate text-sm font-semibold text-slate-700">
            {enquiry.product ||
              "General Enquiry"}
          </p>

          {enquiry.message && (
            <p
              title={
                enquiry.message
              }
              className="mt-1 truncate text-xs text-slate-400"
            >
              {enquiry.message}
            </p>
          )}

        </div>

      </td>

      {/* DATE */}

      <td className="px-5 py-4">

        <p className="whitespace-nowrap text-sm font-medium text-slate-600">
          {formatDate(
            enquiry.created_at
          )}
        </p>

        <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
          {formatTime(
            enquiry.created_at
          )}
        </p>

      </td>

      {/* STATUS */}

      <td className="px-5 py-4">

        <StatusBadge
          status={
            enquiry.status
          }
        />

      </td>

      {/* ACTION */}

      <td className="px-5 py-4 text-right">

        <Link
          href={`/admin/enquiries/${enquiry.id}`}
          className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-[#101820] transition hover:border-slate-300 hover:bg-slate-50"
        >
          View Details
        </Link>

      </td>

    </tr>
  );
}

/*
 * ==========================================================
 * STAT CARD
 * ==========================================================
 */

function StatCard({
  label,
  value,
  description,
  type,
}: {
  label: string;
  value: number;
  description: string;
  type:
    | "total"
    | "new"
    | "contacted"
    | "quotation";
}) {
  const iconBackground =
    type === "new"
      ? "bg-blue-50 text-blue-600"
      : type === "contacted"
      ? "bg-yellow-50 text-yellow-600"
      : type === "quotation"
      ? "bg-purple-50 text-purple-600"
      : "bg-slate-100 text-slate-700";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconBackground}`}
        >

          {type ===
          "total" ? (
            <InboxIcon />
          ) : type ===
            "new" ? (
            <NewIcon />
          ) : type ===
            "contacted" ? (
            <PhoneIcon />
          ) : (
            <QuoteIcon />
          )}

        </div>

      </div>

      <div className="mt-5">

        <p className="text-sm font-medium text-slate-500">
          {label}
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight text-[#101820]">
          {value.toLocaleString(
            "en-IN"
          )}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {description}
        </p>

      </div>

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
  status: string | null;
}) {
  const value =
    status || "Unknown";

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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
        styles[value] ||
        "bg-slate-50 text-slate-600 ring-slate-500/10"
      }`}
    >

      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {value}

    </span>
  );
}

/*
 * ==========================================================
 * EMPTY STATE
 * ==========================================================
 */

function EmptyState({
  hasFilters,
}: {
  hasFilters: boolean;
}) {
  return (
    <div className="px-6 py-20 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <InboxIcon />
      </div>

      <h3 className="mt-5 text-lg font-bold text-[#101820]">
        {hasFilters
          ? "No enquiries found"
          : "No enquiries yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        {hasFilters
          ? "Try changing your search or status filter."
          : "Customer enquiries will appear here when customers submit the enquiry form."}
      </p>

      {hasFilters && (
        <Link
          href="/admin/enquiries"
          className="mt-6 inline-flex rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Clear Filters
        </Link>
      )}

    </div>
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

function SearchIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle
        cx="11"
        cy="11"
        r="7"
      />

      <path d="m20 20-4-4" />
    </svg>
  );
}

function InboxIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 4h16v12H4z" />

      <path d="M4 16l4-4h8l4 4" />

      <path d="M8 20h8" />
    </svg>
  );
}

function NewIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 8v8" />

      <path d="M8 12h8" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />

      <path d="M14 2v6h6" />

      <path d="M8 13h8" />

      <path d="M8 17h5" />
    </svg>
  );
}