import { Suspense } from "react";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import ProductsOverview from "@/components/productsOverview";
const EnquiryForm = dynamic(() => import("@/components/enquiryForm"));
import Footer from "@/components/Footer";

export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <Hero />

      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500">
            Loading products...
          </div>
        }
      >
        <Products />
      </Suspense>

      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500">
            Loading overview...
          </div>
        }
      >
        <ProductsOverview />
      </Suspense>

      <EnquiryForm showImage={true} />

      <Footer />
    </>
  );
}