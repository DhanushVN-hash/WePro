"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  User,
  Mail,
  Phone,
  Package,
  MessageSquare,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

type FormData = {
  name: string;
  email: string;
  phone: string;
  product: string;
  message: string;
};

const getInitialForm = (defaultProduct: string): FormData => ({
  name: "",
  email: "",
  phone: "",
  product: defaultProduct,
  message: "",
});

type EnquiryFormProps = {
  title?: string;
  subtitle?: string;
  defaultProduct?: string;
  /** Path/URL of the left-panel image. Drop your own factory/company photo
   *  into /public and point this at it, e.g. "/images/factory-hero.jpg" */
  imageSrc?: string;
  showImage?: boolean;
};

const TRUST_POINTS = [
  "Quality Products",
  "Expert Support",
  "PAN India Delivery",
  "Trusted by 1000+ Clients",
];

// Small inline WhatsApp glyph so we don't depend on a brand-icon package.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.996.583 3.855 1.588 5.42L2 22l4.7-1.554a9.96 9.96 0 0 0 5.304 1.53h.004c5.518 0 10.004-4.486 10.004-10.004C22.012 6.486 17.526 2 12.004 2zm0 18.174h-.003a8.15 8.15 0 0 1-4.152-1.14l-.298-.177-2.786.922.93-2.716-.194-.279a8.155 8.155 0 0 1-1.253-4.38c0-4.51 3.67-8.18 8.16-8.18 2.18 0 4.228.85 5.77 2.393a8.106 8.106 0 0 1 2.39 5.771c0 4.51-3.67 8.786-8.564 8.786z" />
    </svg>
  );
}

export default function EnquiryForm({
  title = "Send an Enquiry",
  subtitle = "Fill out the form and we'll get back to you.",
  defaultProduct = "",
  imageSrc = "https://res.cloudinary.com/dthrkeu9m/image/upload/f_auto,q_auto/1000181275_i2jdei",
  showImage = true,
}: EnquiryFormProps) {
  const [form, setForm] = useState<FormData>(getInitialForm(defaultProduct));
  const [loading, setLoading] = useState(false);

  // Scroll-triggered fade-in for the form card — presentation only.
  const [visible, setVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.product.trim() ||
      !form.message.trim()
    ) {
      alert("Please fill all fields.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email.");
      return false;
    }

    if (form.phone.length < 10) {
      alert("Please enter a valid phone number.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const { error } = await supabase.from("enquiries").insert([
      {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        product: form.product.trim(),
        message: form.message.trim(),
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);

      alert(error.message);
      return;
    }


      await fetch("/api/enquiry", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Enquiry sent successfully!");

    setForm(getInitialForm(defaultProduct));
  };

  const inputBase =
    "w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm sm:text-base outline-none transition-colors focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/30 disabled:opacity-50";

  return (
    <section id="enquiry" className="relative overflow-hidden">
     <div className={showImage ? "grid lg:grid-cols-2" : "flex justify-center"}>
        {/* LEFT — image / trust panel */}
        {showImage && (
  <div className="relative order-1 h-72 sm:h-96 lg:h-auto lg:min-h-[720px]">
          <img
            src={imageSrc}
            alt="Our manufacturing facility"
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />

          {/* subtle industrial dot pattern, sits under the color overlay */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/30 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/65 lg:to-black/25" />

          <div className="relative z-10 flex h-full flex-col justify-end px-6 py-8 text-white sm:px-10 lg:justify-center lg:px-16 lg:py-0">
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-black">
              Get in touch
            </span>

            <h2 className="max-w-lg text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
              Let&apos;s Discuss Your Requirements
            </h2>

            <p className="mt-3 max-w-md text-sm text-gray-200 sm:text-base">
              Meite Tools supplies industrial-grade pneumatic equipment
              built for reliability, backed by a team that responds fast
              and ships nationwide.
            </p>

            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-center gap-2 text-sm font-medium sm:text-base"
                >
                  <BadgeCheck className="h-5 w-5 shrink-0 text-yellow-400" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        )}

        {/* RIGHT — form */}
        <div
  className={`flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-yellow-50 px-4 py-12 sm:px-8 lg:py-20 ${
    showImage ? "order-2 lg:px-12" : "w-full max-w-4xl mx-auto"
  }`}
>
          <div
            ref={cardRef}
            className={`w-full max-w-xl rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5 transition-all duration-700 ease-out sm:p-8 lg:p-10 ${
              visible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold text-[#101820] sm:text-4xl">
                {title}
              </h2>
              <p className="mt-2 text-gray-600">{subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={inputBase}
                />
              </div>

              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={inputBase}
                />
              </div>

              <div className="relative">
                <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={inputBase}
                />
              </div>

              <div className="relative">
                <Package className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  name="product"
                  type="text"
                  placeholder="Product Name"
                  value={form.product}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={inputBase}
                />
              </div>

              <div className="relative">
                <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-5 w-5 text-gray-400" />
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Your Message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className={`${inputBase} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-black transition-all hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {loading ? "Sending..." : "Send Enquiry"}
                {!loading && (
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <a
                href={`https://wa.me/7338883738?text=${encodeURIComponent(
                  `Hi, I'm interested in ${form.product || "your products"}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 font-semibold text-white transition-all hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}