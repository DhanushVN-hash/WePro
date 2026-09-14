import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black">
      <div className="mx-auto flex min-h-[500px] max-w-7xl flex-col lg:grid lg:grid-cols-2">
        {/* MOBILE: VIDEO FIRST | DESKTOP: VIDEO RIGHT */}
        <div className="relative order-1 min-h-[300px] self-stretch lg:order-2 lg:min-h-[500px]">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/industrial-tools.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* TEXT CONTENT */}
        <div className="order-2 px-6 py-16 text-white sm:px-8 lg:order-1 lg:px-12 lg:py-20">
          <div className="mb-4 h-[3px] w-14 bg-primary" />

          <h1 className="mb-5 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            Industrial Pneumatic Tools
          </h1>

          <p className="mb-8 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
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
      </div>
    </section>
  );
}