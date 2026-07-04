import Link from "next/link";

type Product = {
  id: number;
  name: string;
  slug: string;
  image_url: string | null;
};

export default function ProductGrid({
  products,
}: {
  products: Product[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group block"
        >
          <div className="aspect-square w-full bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-4 transition group-hover:shadow-lg group-hover:scale-[1.02]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-contain p-2 md:p-4"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          <h2 className="font-bold text-[15px] text-gray-900 leading-snug">
            {product.name}
          </h2>
        </Link>
      ))}
    </div>
  );
}