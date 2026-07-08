export default function Home() {
  return (
    <main>
      {/* Navigation with green top and bottom borders */}
      <div className="h-1 bg-[#7C9E87]"></div>
      <nav className="flex items-center justify-between px-8 py-4 bg-[#FDFAF6] border-b-4 border-[#7C9E87] shadow-md">
        <div className="text-2xl font-bold text-[#C4622D]">
          🧶 Handcrafted Haven
        </div>
        <div className="flex gap-8 text-[#3D2B1F] font-medium">
          <a href="#" className="hover:text-[#C4622D] transition-colors">Shop</a>
          <a href="#" className="hover:text-[#C4622D] transition-colors">Sellers</a>
          <a href="#" className="hover:text-[#C4622D] transition-colors">About</a>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 text-[#C4622D] border border-[#C4622D] rounded-full hover:bg-[#C4622D] hover:text-white transition-colors">
            Log in
          </button>
          <button className="px-4 py-2 bg-[#C4622D] text-white rounded-full hover:bg-[#3D2B1F] transition-colors">
            Sign up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between px-12 py-20 bg-[#F5F0E8] overflow-hidden gap-12">
        <div className="flex flex-col items-start max-w-xl z-10">
          <span className="text-[#7C9E87] font-semibold text-lg mb-4 tracking-widest uppercase">
            ✦ Handmade with Love
          </span>
          <h1 className="text-6xl font-bold text-[#3D2B1F] mb-6 leading-tight">
            Discover Unique <span className="text-[#C4622D]">Handcrafted</span> Treasures
          </h1>
          <div className="w-24 h-1 bg-[#7C9E87] mb-6 rounded-full"></div>
          <p className="text-xl text-[#3D2B1F] mb-10 opacity-75 leading-relaxed">
            Connect with talented artisans and find one-of-a-kind handmade items that tell a story. Every piece is made with passion and care.
          </p>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Shop Now
            </button>
            <button className="px-8 py-4 border-2 border-[#C4622D] text-[#C4622D] rounded-full text-lg font-medium hover:bg-[#C4622D] hover:text-white transition-all duration-300">
              Become a Seller
            </button>
          </div>
        </div>

        <div className="relative flex-shrink-0" style={{animation: 'float 4s ease-in-out infinite'}}>
          <div className="absolute top-6 left-6 w-80 h-96 bg-[#7C9E87] rounded-3xl opacity-30"></div>
          <div className="absolute top-3 left-3 w-80 h-96 bg-[#C4622D] rounded-3xl opacity-20"></div>
          <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F5F0E8]">
            <img 
              src="/handcrafted-hero.webp" 
              alt="Colorful handcrafted goods" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#3D2B1F] to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white font-bold text-lg">
              Handcrafted with ❤️
            </div>
          </div>
          <div className="absolute -top-4 -right-4 bg-[#7C9E87] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            1000+ Vendors
          </div>
          <div className="absolute -bottom-4 -left-4 bg-[#3D2B1F] text-[#F5F0E8] px-3 py-1 rounded-full text-sm shadow-lg">
            Handmade ✦
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Jewelry", emoji: "💍", desc: "Handcrafted rings, necklaces, and bracelets" },
            { name: "Home Decor", emoji: "🏺", desc: "Unique pieces to beautify your space" },
            { name: "Clothing", emoji: "🧵", desc: "One-of-a-kind wearable art" },
            { name: "Music & Instruments", emoji: "🎸", desc: "Custom handcrafted guitars, ukuleles, and more" },
            { name: "Bath & Beauty", emoji: "🧴", desc: "Handmade soaps, lotions, and natural skincare" },
            { name: "Art & Collectibles", emoji: "🎨", desc: "Original artwork and unique collectible pieces" },
          ].map((category) => (
            <div 
              key={category.name}
              className="flex flex-col items-center p-8 bg-[#F5F0E8] rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-b-4 border-[#7C9E87]"
            >
              <span className="text-5xl mb-4">{category.emoji}</span>
              <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">{category.name}</h3>
              <p className="text-center text-[#3D2B1F] opacity-70">{category.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-8 py-16 bg-[#F5F0E8]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">
            Featured Products
          </h2>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { name: "Ceramic Bowl Set", price: "$45", seller: "Clay & Co", emoji: "🏺" },
            { name: "Macrame Wall Art", price: "$78", seller: "Knotted Dreams", emoji: "🪢" },
            { name: "Hand-dyed Scarf", price: "$52", seller: "Color Flow Studio", emoji: "🧣" },
            { name: "Custom Guitar", price: "$299", seller: "Strings & Things", emoji: "🎸" },
            { name: "Lavender Soap Set", price: "$24", seller: "Pure Botanicals", emoji: "🧴" },
            { name: "Watercolor Print", price: "$65", seller: "Artisan Brush Co", emoji: "🎨" },
          ].map((product) => (
            <div 
              key={product.name}
              className="bg-[#FDFAF6] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-center justify-center h-48 bg-[#F5F0E8] text-7xl border-b-4 border-[#7C9E87]">
                {product.emoji}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#3D2B1F] mb-1">{product.name}</h3>
                <p className="text-[#7C9E87] text-sm mb-2">by {product.seller}</p>
                <div className="text-sm text-[#C4622D] mb-3">⭐⭐⭐⭐⭐ <span className="text-[#3D2B1F] opacity-60">(24 reviews)</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#C4622D]">{product.price}</span>
                  <button className="px-4 py-2 bg-[#C4622D] text-white rounded-full text-sm hover:bg-[#3D2B1F] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer with green top border */}
      <div className="h-1 bg-[#7C9E87]"></div>
      <footer className="px-8 py-12 bg-[#3D2B1F] text-[#F5F0E8]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#C4622D] mb-4">🧶 Handcrafted Haven</h3>
            <p className="opacity-75 max-w-xs">
              Connecting artisans with people who appreciate the beauty of handmade products.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-[#7C9E87]">Quick Links</h4>
            <ul className="space-y-2 opacity-75">
              <li><a href="#" className="hover:text-[#C4622D] transition-colors">Shop</a></li>
              <li><a href="#" className="hover:text-[#C4622D] transition-colors">Become a Seller</a></li>
              <li><a href="#" className="hover:text-[#C4622D] transition-colors">About Us</a></li>
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  )
}