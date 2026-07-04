import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import Footer from "@/components/Footer";
import EnquiryForm from "@/components/enquiryForm";
import ProductsOverview from "@/components/productsOverview";


export default function Home() {
  return (
    <>
      
      <Hero />
      <Products />
      <ProductsOverview/>
      <EnquiryForm showImage={true} />
      <Footer />
    </>
  );
}