import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Enquiry = {
  id: string;
  name: string | null;
  product: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  created_at: string;
};

type ChartPoint = {
  label: string;
  count: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const now = new Date();

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  /*
   * ------------------------------------------------------
   * Dashboard statistics
   * ------------------------------------------------------
   */

  const [
    { count: productCount },
    { count: enquiryCount },
    { count: newCount },
    { count: todayCount },
  ] = await Promise.all([
    supabase
      .from("products")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status", "New"),

    supabase
      .from("enquiries")
      .select("*", {
        count: "exact",
        head: true,
      })
      .gte("created_at", today.toISOString())
      .lt("created_at", tomorrow.toISOString()),
  ]);

  /*
   * ------------------------------------------------------
   * Recent enquiries
   * ------------------------------------------------------
   */

  const { data: recentData } = await supabase
    .from("enquiries")
    .select(
      "id, name, product, phone, email, status, created_at"
    )
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  const recentEnquiries: Enquiry[] =
    recentData ?? [];

  /*
   * ------------------------------------------------------
   * Enquiries for the last 7 days
   * ------------------------------------------------------
   */

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(
    sevenDaysAgo.getDate() - 6
  );

  const { data: chartData } = await supabase
    .from("enquiries")
    .select("created_at")
    .gte(
      "created_at",
      sevenDaysAgo.toISOString()
    )
    .lt(
      "created_at",
      tomorrow.toISOString()
    );

  /*
   * Build 7-day chart
   */

  const chart: ChartPoint[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(sevenDaysAgo);

    date.setDate(
      sevenDaysAgo.getDate() + i
    );

    const dateKey =
      date.toISOString().split("T")[0];

    const count =
      chartData?.filter((item) => {
        return (
          item.created_at.split("T")[0] ===
          dateKey
        );
      }).length ?? 0;

    chart.push({
      label: date.toLocaleDateString(
        "en-IN",
        {
          weekday: "short",
        }
      ),
      count,
    });
  }

  const maxChartValue = Math.max(
    ...chart.map((item) => item.count),
    1
  );

  /*
   * ------------------------------------------------------
   * Dashboard
   * ------------------------------------------------------
   */

  return (
    <div className="mx-auto w-full max-w-[1600px] p-5 sm:p-7 lg:p-8">
      {/* ==========================================
          PAGE HEADER
          ========================================== */}

      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            Overview
          </p>

          <h1 className="text-3xl font-black tracking-tight text-[#101820] sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
            Monitor products, enquiries and
            day-to-day business activity.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-yellow-400 px-5 text-sm font-bold text-[#101820] shadow-sm transition hover:bg-yellow-300"
          >
            + Add Product
          </Link>

          <Link
            href="/admin/enquiries"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-[#101820] shadow-sm transition hover:bg-slate-50"
          >
            View Enquiries
          </Link>
        </div>
      </div>

      {/* ==========================================
          KPI CARDS
          ========================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Products"
          value={productCount ?? 0}
          description="Products in catalogue"
          icon={<ProductsIcon />}
          href="/admin/products"
        />

        <StatCard
          title="Total Enquiries"
          value={enquiryCount ?? 0}
          description="All customer enquiries"
          icon={<EnquiriesIcon />}
          href="/admin/enquiries"
        />

        <StatCard
          title="New Enquiries"
          value={newCount ?? 0}
          description="Waiting for attention"
          icon={<NewEnquiryIcon />}
          href="/admin/enquiries"
          highlight
        />

        <StatCard
          title="Today's Enquiries"
          value={todayCount ?? 0}
          description="Received today"
          icon={<TodayIcon />}
          href="/admin/enquiries"
        />
      </div>

      {/* ==========================================
          CHART + QUICK ACTIONS
          ========================================== */}

      <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_330px]">
        {/* Chart */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#101820]">
                Enquiry Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customer enquiries received over
                the last 7 days.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              Enquiries
            </div>
          </div>

          <div className="mt-8 flex h-[220px] items-end gap-3 sm:gap-5">
            {chart.map((item) => {
              const height =
                item.count === 0
                  ? 4
                  : Math.max(
                      (item.count /
                        maxChartValue) *
                        170,
                      12
                    );

              return (
                <div
                  key={item.label}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="mb-2 text-xs font-semibold text-slate-500">
                    {item.count}
                  </div>

                  <div
                    className="w-full max-w-[44px] rounded-t-lg bg-yellow-400 transition-all"
                    style={{
                      height: `${height}px`,
                    }}
                  />

                  <div className="mt-3 text-xs font-medium text-slate-400">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#101820]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Common admin tasks.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <QuickAction
              href="/admin/products/new"
              icon={<PlusIcon />}
              title="Add Product"
              description="Create a new catalogue item"
            />

            <QuickAction
              href="/admin/products"
              icon={<ProductsIcon />}
              title="Manage Products"
              description="Edit your product catalogue"
            />

            <QuickAction
              href="/admin/enquiries"
              icon={<EnquiriesIcon />}
              title="View Enquiries"
              description="Review customer requests"
            />
          </div>
        </section>
      </div>

      {/* ==========================================
          RECENT ENQUIRIES
          ========================================== */}

      <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#101820]">
              Recent Enquiries
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              The latest customer enquiries received.
            </p>
          </div>

          <Link
            href="/admin/enquiries"
            className="text-sm font-bold text-[#101820] hover:text-yellow-600"
          >
            View all →
          </Link>
        </div>

        {recentEnquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Enquiry
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Date
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentEnquiries.map(
                  (enquiry) => (
                    <tr
                      key={enquiry.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-500">
                          ENQ-
                          {enquiry.id
                            .slice(0, 8)
                            .toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#101820]">
                          {enquiry.name ||
                            "Unknown"}
                        </div>

                        <div className="mt-1 text-xs text-slate-400">
                          {enquiry.email ||
                            "No email"}
                        </div>
                      </td>

                      <td className="max-w-[220px] px-6 py-4">
                        <div className="truncate text-sm font-medium text-slate-700">
                          {enquiry.product ||
                            "General enquiry"}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                        {formatDate(
                          enquiry.created_at
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={
                            enquiry.status
                          }
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/enquiries/${enquiry.id}`}
                          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[#101820] transition hover:border-slate-300 hover:bg-slate-50"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <EnquiriesIcon />
            </div>

            <h3 className="mt-4 font-bold text-[#101820]">
              No enquiries yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Customer enquiries will appear here.
            </p>
          </div>
        )}
      </section>

      {/* ==========================================
          FUTURE FEATURES
          ========================================== */}

      <section className="mt-7 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
              Coming next
            </p>

            <h2 className="mt-1 text-base font-bold text-[#101820]">
              More business tools are coming
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Customer management, quotations,
              pricing and reports will be added
              to the admin system.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              Customers
            </span>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              Quotations
            </span>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              Pricing
            </span>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm">
              Reports
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ======================================================
   STAT CARD
   ====================================================== */

function StatCard({
  title,
  value,
  description,
  icon,
  href,
  highlight = false,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            highlight
              ? "bg-yellow-100 text-yellow-700"
              : "bg-slate-100 text-[#101820]"
          }`}
        >
          {icon}
        </div>

        <span className="text-slate-300 transition-transform group-hover:translate-x-1">
          →
        </span>
      </div>

      <div className="mt-6">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <p className="mt-1 text-3xl font-black tracking-tight text-[#101820]">
          {value.toLocaleString("en-IN")}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}

/* ======================================================
   QUICK ACTION
   ====================================================== */

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#101820]">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-bold text-[#101820]">
          {title}
        </p>

        <p className="mt-0.5 truncate text-xs text-slate-500">
          {description}
        </p>
      </div>

      <span className="ml-auto text-slate-300">
        →
      </span>
    </Link>
  );
}

/* ======================================================
   STATUS BADGE
   ====================================================== */

function StatusBadge({
  status,
}: {
  status: string | null;
}) {
  const value = status || "Unknown";

  const styles: Record<
    string,
    string
  > = {
    New: "bg-blue-50 text-blue-700 ring-blue-600/10",
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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
        styles[value] ||
        "bg-slate-50 text-slate-600 ring-slate-500/10"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />

      {value}
    </span>
  );
}

/* ======================================================
   DATE
   ====================================================== */

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

/* ======================================================
   ICONS
   ====================================================== */

function ProductsIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function EnquiriesIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 9.2 9.2 0 0 1-4-.9L3 21l1.9-4A8.2 8.2 0 0 1 3 11.5a8.38 8.38 0 0 1 9-8.5 8.38 8.38 0 0 1 9 8.5Z" />
      <path d="M8 11h.01" />
      <path d="M12 11h.01" />
      <path d="M16 11h.01" />
    </svg>
  );
}

function NewEnquiryIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function TodayIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect
        x="3"
        y="4"
        width="18"
        height="17"
        rx="2"
      />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}