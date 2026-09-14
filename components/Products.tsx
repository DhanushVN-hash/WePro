import { supabase } from "@/lib/supabase";
import ProductCarousel from "@/components/ProductCarousel";

export default async function Products() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, slug, name, image_url")
    .order("id")
    .limit(16);

  if (error) {
    console.error("Failed to load products:", error.message);
  }

  return (
    <section className="py-10">
      <h2 className="mb-8 text-center text-4xl font-bold text-[#101820]">
        PNEUMATIC TOOLS
      </h2>

      <div className="mx-auto max-w-7xl px-6">
        <ProductCarousel products={products || []} />
      </div>
    </section>
  );
}