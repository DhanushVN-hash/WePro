"use client";

import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

interface Product {
  id: string;
  slug: string;
  name: string;
  image_url?: string;
}

export default function ProductCarousel({
  products,
}: {
  products: Product[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!products.length) {
    return (
      <p className="text-center text-gray-400 py-10">
        No products available right now.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">


{products.map((product) => (
  <Link
    key={product.id}
    href={`/products/${product.slug}`}
    className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] p-3"
  >
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer">

              <div className="relative h-72 w-full bg-white">
                {product.image_url?.trim() ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain bg-white p-4"
                    sizes="320px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold line-clamp-1 text-[#101820]">
                  {product.name}
                </h3>

              </div>
               </div>
  </Link>
          ))}
            </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous products"
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors items-center justify-center"
      >
        <ChevronLeft className="text-[#101820]" />
      </button>
      <button
        onClick={scrollNext}
        aria-label="Next products"
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow transition-colors items-center justify-center"
      >
        <ChevronRight className="text-[#101820]" />
      </button>
    </div>
  );
}