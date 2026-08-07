import Link from "next/link";
import { FaFacebook, FaXTwitter, FaInstagram } from "react-icons/fa6";
import { Mail, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#3D2B1F] text-[#F5F0E8] border-t-4 border-[#7C9E87]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <h3 className="text-2xl font-bold text-[#C4622D] tracking-wide hover:opacity-90 transition-opacity">
                🧶 Handcrafted Haven
              </h3>
            </Link>
            <p className="text-sm text-[#F5F0E8]/80 leading-relaxed">
              Connecting passionate artisans with people who appreciate the
              unique beauty of handmade products.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2.5 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C4622D] text-[#F5F0E8] hover:text-white transition-all duration-300"
              >
                <FaFacebook className="w-4 h-4" />
              </Link>

              <Link
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="p-2.5 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C4622D] text-[#F5F0E8] hover:text-white transition-all duration-300"
              >
                <FaXTwitter className="w-4 h-4" />
              </Link>

              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="p-2.5 rounded-full bg-[#FAF7F2]/10 hover:bg-[#C4622D] text-[#F5F0E8] hover:text-white transition-all duration-300"
              >
                <FaInstagram className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#7C9E87] tracking-wider uppercase text-xs">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#F5F0E8]/80">
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#C4622D] transition-colors"
                >
                  Shop Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/sellers"
                  className="hover:text-[#C4622D] transition-colors"
                >
                  Meet Our Artisans
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#C4622D] transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="font-semibold text-lg mb-4 text-[#7C9E87] tracking-wider uppercase text-xs">
              Support & Contact
            </h4>
            <ul className="space-y-3 text-sm text-[#F5F0E8]/80">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C4622D]" />
                <a
                  href="mailto:hello@handcraftedhaven.com"
                  className="hover:text-[#C4622D] transition-colors"
                >
                  hello@handcraftedhaven.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7C9E87]" />
                <span>Buyer & Seller Protection</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Value prop */}
          <div className="space-y-3">
            <h4 className="font-semibold text-lg text-[#7C9E87] tracking-wider uppercase text-xs">
              Join Our Community
            </h4>
            <p className="text-xs text-[#F5F0E8]/70">
              Discover new handcrafted collections and support local creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-[#C4622D] text-white text-xs font-semibold rounded-full hover:bg-[#a54f22] text-center transition-all duration-300 shadow-md"
              >
                Become a Seller
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-[#7C9E87]/30 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5F0E8]/60 gap-4">
          <p>
            © {new Date().getFullYear()} Handcrafted Haven. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            Made with{" "}
            <Heart className="w-3.5 h-3.5 text-[#C4622D] fill-[#C4622D]" /> for
            artisans everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
