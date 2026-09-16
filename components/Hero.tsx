
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate h-[480px] overflow-hidden bg-black sm:h-[520px] lg:h-[565px]">
      {/* BACKGROUND VIDEO */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="/videos/industrial-tools.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* DARK GRADIENT OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/65 to-black/10" />

      {/* HERO CONTENT */}
      <div className="mx-auto flex h-full max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl text-white">
          {/* ACCENT LINE */}
          <div className="mb-6 h-[4px] w-16 bg-primary" />

          {/* HEADING */}
          <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Industrial
            <br />
            Pneumatic Tools
          </h1>

          {/* DESCRIPTION */}
          <p className="mb-10 max-w-2xl text-base leading-relaxed text-gray-200 sm:text-lg lg:text-xl">
            Precision. Performance. Reliability.
            <br className="hidden sm:block" />
            Premium pneumatic tools and fastening solutions
            for industrial and professional applications.
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-7 py-3.5 font-semibold text-black transition-colors duration-300 hover:bg-yellow-400"
            >
              View Products
              
            </Link>

            <Link
              href="/#enquiry"
              className="inline-flex items-center justify-center rounded-lg border border-white/80 px-7 py-3.5 font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
    </section>
  );
}