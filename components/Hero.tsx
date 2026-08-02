import Link from "next/link";
import EnquiryForm from "@/components/enquiryForm"; // remove if truly unused elsewhere

export default function Hero() {
  return (
    <section className="relative min-h-[75vh] md:h-screen flex items-center overflow-hidden">
      <picture className="absolute inset-0 block w-full h-full">
        <source
          media="(min-width: 768px)"
          srcSet="https://res.cloudinary.com/dthrkeu9m/image/upload/f_auto,q_auto,w_1920/c2f06e95-954d-4bc1-bc28-2b04fd030fbf_fivcac"
        />
        <img
          src="https://res.cloudinary.com/allujgvo/image/upload/f_auto,q_auto,w_800/v1785675096/ChatGPT_Image_Aug_2_2026_06_18_52_PM_lwjdgy.png"
          alt="Industrial Pneumatic Tools"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </picture>

      <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight mb-5">
          Industrial Pneumatic Tools
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
          Precision. Performance. Reliability. Premium pneumatic tools and
          fastening solutions for industrial and professional applications.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-black transition hover:bg-yellow-400"
          >
            View Products
          </Link>

          <Link
            href="/#enquiry"
            className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-black"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}