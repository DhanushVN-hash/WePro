import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split("T")[0];

  const [{ count: productCount }, { count: enquiryCount }, { count: newCount }, { count: todayCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),

      supabase.from("enquiries").select("*", { count: "exact", head: true }),

      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .eq("status", "New"),

      supabase
        .from("enquiries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`),
    ]);

  const { data: recentEnquiries } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="p-10">

      <h1 className="text-4xl font-bold text-[#101820]">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

        <Card title="Total Products" value={productCount} />

        <Card title="Total Enquiries" value={enquiryCount} />

        <Card title="New Enquiries" value={newCount} />

        <Card title="Today's Enquiries" value={todayCount} />

      </div>

      <div className="mt-12">

        <h2 className="text-2xl font-bold mb-5">
          Recent Enquiries
        </h2>

        <table className="w-full border">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-3">ID</th>
              <th>Name</th>
              <th>Product</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Status</th>

            </tr>

          </thead>

          <tbody>

            {recentEnquiries?.map((e) => (

              <tr key={e.id} className="border-t">

                <td className="p-3">{e.id}</td>
                <td>{e.name}</td>
                <td>{e.product}</td>
                <td>{e.phone}</td>
                <td>{e.email}</td>
                <td>{e.status}</td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="mt-10 flex gap-5">

        <Link
          href="/admin/products"
          className="bg-yellow-500 px-5 py-3 rounded-lg font-semibold"
        >
          Manage Products
        </Link>

        <Link
          href="/admin/products/new"
          className="bg-black text-white px-5 py-3 rounded-lg"
        >
          Add Product
        </Link>

        <Link
          href="/admin/enquiries"
          className="border px-5 py-3 rounded-lg"
        >
          View Enquiries
        </Link>

      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: number | null;
}) {
  return (
    <div className="bg-white rounded-xl shadow border p-6">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {value ?? 0}
      </h2>

    </div>
  );
}