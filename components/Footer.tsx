import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const categories = [
  {
    name: "Pneumatic Nailers & Staplers",
    href: "/products?category=3",
  },
  {
    name: "Fasteners",
    href: "/products?category=4",
  },
  {
    name: "Spray Guns",
    href: "/products?category=5",
  },
  {
    name: "Pneumatic Tools",
    href: "/products?category=6",
  },
  {
    name: "Accessories",
    href: "/products?category=7",
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-gray-300">

      {/* Top accent */}
      <div className="h-1 bg-primary" />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">

      
        {/* Footer columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* Company */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                WE PRO
              </h2>

              <p className="text-primary font-semibold tracking-[0.15em] text-sm mt-1">
                INDUSTRIAL PRODUCTS
              </p>
            </Link>

            <p className="mt-6 leading-7 text-gray-400">
              Authorized distributor of MEITE Pneumatic Tools,
              Fasteners, Compressors and Industrial Accessories.
              Delivering reliable industrial solutions across India.
            </p>

            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Trusted Industrial Solutions
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">
              Quick Links
            </h3>

            <ul className="space-y-3.5">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>

              <li>
                <Link
                  href="/#enquiry"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/#enquiry"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  Request a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">
              Products
            </h3>

            <ul className="space-y-3.5">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">
              Contact Us
            </h3>

            <div className="space-y-5">

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone
                  className="text-primary mt-1 shrink-0"
                  size={18}
                />

                <div className="flex flex-col gap-1">
                  <a
                    href="tel:+917338883738"
                    className="hover:text-primary transition-colors"
                  >
                    +91 73388 83738
                  </a>

                  <a
                    href="tel:+919382888810"
                    className="hover:text-primary transition-colors"
                  >
                    +91 93828 88810
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail
                  className="text-primary mt-1 shrink-0"
                  size={18}
                />

                <a
                  href="mailto:weproindustrial@gmail.com"
                  className="break-all hover:text-primary transition-colors"
                >
                  weproindustrial@gmail.com
                </a>
              </div>

              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin
                  className="text-primary mt-1 shrink-0"
                  size={19}
                />

                <address className="not-italic leading-6 text-gray-400">
                  No. 92, Yeshwanth Nagar Main Road,
                  <br />
                  Madambakkam,
                  <br />
                  Chennai – 600126,
                  <br />
                  Tamil Nadu, India
                </address>
              </div>

            </div>

            {/* Social */}
            <div className="flex gap-3 mt-7">

              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all duration-300 hover:-translate-y-1"
              >
                <FaFacebookF size={17} />
              </a>

              <a
                href="https://www.instagram.com/weproindustrial?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all duration-300 hover:-translate-y-1"
              >
                <FaInstagram size={17} />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[#242424] flex items-center justify-center text-gray-400 hover:bg-primary hover:text-black transition-all duration-300 hover:-translate-y-1"
              >
                <FaLinkedinIn size={17} />
              </a>

            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">

          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} WE PRO Industrial Products.
            All Rights Reserved.
          </p>

          <p>
            Industrial Pneumatic Tools & Fastening Solutions
          </p>

        </div>

      </div>
    </footer>
  );
}