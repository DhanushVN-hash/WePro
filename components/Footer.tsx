import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#1F1F1F] text-gray-300 mt-20">
      {/* Yellow Top Border */}
      <div className="h-1 bg-yellow-500"></div>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-4 md:grid-cols-2 gap-12">

        {/* Company */}
        <div>
          <h2 className="text-3xl font-extrabold text-white">
            WE PRO
          </h2>

          <p className="text-yellow-500 font-semibold tracking-wide mt-1">
            INDUSTRIAL PRODUCTS
          </p>

          <p className="mt-5 leading-7 text-gray-400">
            Authorized distributor of MEITE Pneumatic Tools,
            Fasteners, Compressors and Industrial Accessories.
            Delivering quality products across India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3">
            <li>
              <Link href="/" className="hover:text-yellow-500 transition">
                Home
              </Link>
            </li>

            <li>
              <Link href="/products" className="hover:text-yellow-500 transition">
                Products
              </Link>
            </li>

            <li>
              <Link href="/about" className="hover:text-yellow-500 transition">
                About Us
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-yellow-500 transition">
                Contact
              </Link>
            </li>

            <li>
              <Link href="/gallery" className="hover:text-yellow-500 transition">
                Gallery
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Categories
          </h3>

          <ul className="space-y-3">
            <li>Air Nailers</li>
            <li>Staplers</li>
            <li>Fasteners</li>
            <li>Compressors</li>
            <li>Accessories</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-5">
            Contact Us
          </h3>

          <div className="space-y-4">

            <div className="flex items-start gap-3">
              <Phone className="text-yellow-500 mt-1" size={18} />
              <span>7338883738</span>
              <span>9382888810</span>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="text-yellow-500 mt-1" size={18} />
              <span>weproindustrial@gmail.com</span>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="text-yellow-500 mt-1" size={18} />
              <span>
                Chennai, Tamil Nadu,
                India
              </span>
            </div>

          </div>

          {/* Social Icons */}
          <div className="flex gap-4 mt-8">

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="#"
              className="w-10 h-10 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-yellow-500 hover:text-black transition"
            >
              <FaLinkedinIn size={18} />
            </a>

          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">

          <p>
            © {new Date().getFullYear()} WE PRO Industrial Products. All Rights Reserved.
          </p>


        </div>
      </div>
    </footer>
  );
}