import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative isolate h-[450px] overflow-hidden bg-black sm:h-[520px] lg:h-[640px]">

      {/* DESKTOP VIDEO */}
      <video
        className="absolute inset-0 -z-20 hidden h-full w-full object-cover lg:block"
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
      </video>

      {/* MOBILE VIDEO */}
      <video
        className="absolute inset-0 -z-20 block h-full w-full object-cover lg:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source
          src="/videos/industrial-tools-mobile.mp4"
          type="video/mp4"
        />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 -z-10 bg-black/35" />

      {/* LEFT SIDE DARK GRADIENT */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-transparent" />

      {/* HERO CONTENT */}
      <div className="mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-38">
        <div className="w-full max-w-3xl text-white">

          {/* TOP LABEL */}
          <h1 className="mb-5 text-2xl font-bold leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-[38px]">
           PNEUMATIC TOOLS · INDUSTRIAL SOLUTIONS
          </h1>

          {/* TAGLINE */}
          <p className="mb-9 text-xl font-medium text-white sm:text-2xl md:text-[27px]">
            Powerful. Reliable. Professional.
          </p>

          {/* CTA */}
          <Link
            href="/products"
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              bg-primary
              px-5
              py-3
              text-base
              font-bold
              text-black
              shadow-[0_4px_0_#a16207]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-yellow-400
              hover:shadow-[0_5px_0_#a16207]
              active:translate-y-0
              active:shadow-[0_2px_0_#a16207]
              sm:px-6
              sm:py-3.5
              sm:text-lg
            "
          >
            View Full Product Details
          </Link>

        </div>
      </div>

      {/* BOTTOM FADE */}
      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          h-20
          bg-gradient-to-t
          from-black/30
          to-transparent
        "
      />
    </section>
  );
} 