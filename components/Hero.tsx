import Link from "next/link";
import EnquiryForm from "@/components/enquiryForm";
export default function Hero() {
  return (
    <section
      className="relative h-screen flex items-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dthrkeu9m/image/upload/f_auto,q_auto/c2f06e95-954d-4bc1-bc28-2b04fd030fbf_fivcac')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-7xl mx-auto px-6 text-white">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
          Industrial Pneumatic Tools
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
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