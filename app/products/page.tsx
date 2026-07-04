import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { supabase } from "@/lib/supabase";
import ProductSidebar from "@/components/ProductSidebar";
import MobileFilters from "@/components/MobileFilters";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
  }>;
}) {
  const { category, subcategory } = await searchParams;

  const categoryId = Number(category ?? 3);

  // Current category
  const { data: currentCategory } = await supabase
    .from("categories")
    .select("name")
    .eq("id", categoryId)
    .single();

  // Sidebar
  const { data: subcategories } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .order("name");

  // Products
  let query = supabase
    .from("products")
    .select(`*, subcategories(name)`, { count: "exact" })
    .eq("category_id", categoryId)
    .order("id");

  if (subcategory) {
    query = query.eq("subcategory_id", Number(subcategory));
  }

  const { data: products, count } = await query;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
        {currentCategory?.name}
      </h1>

      <p className="mt-2 mb-10 text-amber-600 font-medium">
        {count ?? 0} Products
      </p>



      <MobileFilters
        categoryId={categoryId}
        subcategory={subcategory}
        subcategories={subcategories ?? []}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
      <div className="hidden lg:block">
        <ProductSidebar
          categoryId={categoryId}
          subcategory={subcategory}
          subcategories={subcategories ?? []}
        />
      </div>

      {/* products  */}
        <div className="flex-1">
          <ProductGrid products={products ?? []} />
        </div>
      </div>
    </div>
  );
}