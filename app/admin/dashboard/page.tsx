import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function DashboardPage() {
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold text-[#101820]">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold mt-1">{productCount ?? "-"}</p>
        </div>
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/admin/products"
          className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-lg font-semibold transition-colors"
        >
          Manage Products
        </Link>
        <Link
          href="/admin/products/new"
          className="border border-gray-300 px-5 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          + Add Product
        </Link>
      </div>
    </div>
  );
}