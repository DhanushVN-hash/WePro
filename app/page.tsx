import { Suspense } from "react";
import dynamic from "next/dynamic";

import Hero from "@/components/Hero";
import Products from "@/components/Products";
import ProductsOverview from "@/components/productsOverview";
import ScrollReveal from "@/components/ScrollReveal";
import Footer from "@/components/Footer";

const EnquiryForm = dynamic(() => import("@/components/enquiryForm"));

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />

      <ScrollReveal>
        <Suspense
          fallback={
            <div className="py-20 text-center text-gray-500">
              Loading products...
            </div>
          }
        >
          <Products />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal>
        <Suspense
          fallback={
            <div className="py-20 text-center text-gray-500">
              Loading overview...
            </div>
          }
        >
          <ProductsOverview />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal>
        <EnquiryForm showImage={true} />
      </ScrollReveal>

      <Footer />
    </>
  );
}