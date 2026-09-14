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

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (!products.length) {
    return (
      <p className="py-10 text-center text-gray-400">
        No products available right now.
      </p>
    );
  }

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="min-w-0 flex-[0_0_100%] p-3 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%]"
            >
              <div className="group text-center">
                <div className="relative h-72 w-full">
                  {product.image_url?.trim() ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      sizes="320px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <h3 className="mt-4 line-clamp-1 text-xl font-bold text-[#101820] transition-colors group-hover:text-yellow-500">
                  {product.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        aria-label="Previous products"
        className="absolute left-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow transition-colors hover:bg-white md:flex"
      >
        <ChevronLeft className="text-[#101820]" />
      </button>

      <button
        onClick={scrollNext}
        aria-label="Next products"
        className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/90 p-2 shadow transition-colors hover:bg-white md:flex"
      >
        <ChevronRight className="text-[#101820]" />
      </button>
    </div>
  );
}