import { AtSign, MessageCircle, Video } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <div className="h-1 bg-[#7C9E87]"></div>
      <footer className="px-8 py-12 bg-[#3D2B1F] text-[#F5F0E8]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#C4622D] mb-4">🧶 Handcrafted Haven</h3>
            <p className="opacity-75 max-w-xs mb-4">
              Connecting artisans with people who appreciate the beauty of handmade products.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Instagram" className="hover:text-[#C4622D] transition-colors">
                <AtSign className="w-5 h-5" />
              </a>
              <a href="#" aria-label="Facebook" className="hover:text-[#C4622D] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-[#C4622D] transition-colors">
                <Video className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#7C9E87]">Quick Links</h4>
            <ul className="space-y-2 opacity-75">
              <li><a href="/shop" className="hover:text-[#C4622D] transition-colors">Shop</a></li>
              <li><a href="/sellers" className="hover:text-[#C4622D] transition-colors">Become a Seller</a></li>
              <li><a href="/about" className="hover:text-[#C4622D] transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#7C9E87]">Contact</h4>
            <ul className="space-y-2 opacity-75">
              <li>hello@handcraftedhaven.com</li>
              <li>Support Center</li>
            </ul>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-8 border-t border-[#7C9E87] text-center opacity-50 text-sm">
          © 2026 Handcrafted Haven. Made with ❤️ by artisans everywhere.
        </div>
      </footer>
    </>
  );
}
