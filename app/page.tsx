import dynamic from "next/dynamic";
import Hero from "@/components/Hero";

const Products = dynamic(() => import("@/components/Products"));
const ProductsOverview = dynamic(() => import("@/components/productsOverview"));
const EnquiryForm = dynamic(() => import("@/components/enquiryForm"));
const Footer = dynamic(() => import("@/components/Footer"));

export default function Home() {
  return (
    <>
      <Hero />

      <Products />

      <ProductsOverview />

      <EnquiryForm showImage={true} />

      <Footer />
    </>
  );
}