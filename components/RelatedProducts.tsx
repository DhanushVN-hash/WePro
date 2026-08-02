import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export const revalidate = 3600;

export default async function RelatedProducts({
  currentSlug,
}: {
  currentSlug: string;
}) {
  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, image_url")
    .neq("slug", currentSlug)
    .order("id")
    .limit(4);

  if (!products?.length) return null;

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold mb-8 text-[#101820]">
        Related Products
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => {
         const imageUrl = product.image_url;

          return (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group border rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative w-full h-52 bg-white">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    loading="lazy"
                    quality={65}
                    sizes="(max-width:768px) 50vw,25vw"
                    className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-[#101820] line-clamp-2">
                  {product.name}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}