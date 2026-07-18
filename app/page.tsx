import Link from "next/link";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { getDb } from "@/app/lib/db";
import { Category } from "@/app/lib/types";

// Extended interface specifically for UI presentation to join the seller name
interface StorefrontProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  image_alt: string;
  seller_name: string; // From the users JOIN query
}

export default async function Home() {
  let categories: Category[] = [];
  let products: StorefrontProduct[] = [];

  try {
    const db = getDb();

    // 1. Fetch Categories directly on the server side
    const categoriesResult = await db.query(
      "SELECT id, name, image_url, image_alt, description FROM categories ORDER BY id ASC",
    );
    categories = categoriesResult.rows;

    // 2. Fetch Featured Products with Seller Name verification via relational JOIN
    const productsQuery = `
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.price, 
        p.image_url, 
        p.image_alt, 
        u.name AS seller_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 6;
    `;
    const productsResult = await db.query(productsQuery);
    products = productsResult.rows;
  } catch (error) {
    console.error(
      "Database connection failed on the landing page server component:",
      error,
    );
    // Graceful fallbacks to maintain structural layout even if database nodes bounce
    categories = [];
    products = [];
  }

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section className="bg-[#F5F0E8] px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="flex flex-col items-start">
            <span className="text-[#7C9E87] font-semibold text-sm sm:text-base md:text-lg mb-4 tracking-widest uppercase">
              ✦ Handmade with Love
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#3D2B1F] mb-6 leading-tight">
              Discover Unique{" "}
              <span className="text-[#C4622D]">Handcrafted</span> Treasures
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mb-6 rounded-full"></div>
            <p className="text-base sm:text-lg md:text-xl text-[#3D2B1F] mb-8 md:mb-10 opacity-75 leading-relaxed">
              Connect with talented artisans and find one-of-a-kind handmade
              items that tell a story. Every piece is made with passion and
              care.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-[#C4622D] text-white rounded-full text-base sm:text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Shop Now
              </Link>
              <Link
                href="/sellers"
                className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#C4622D] text-[#C4622D] rounded-full text-base sm:text-lg font-medium hover:bg-[#C4622D] hover:text-white transition-all duration-300"
              >
                Become a Seller
              </Link>
            </div>
          </div>

          <div
            className="relative w-full max-w-md mx-auto md:max-w-none"
            style={{ animation: "float 4s ease-in-out infinite" }}
          >
            <div className="absolute top-6 left-6 w-full aspect-[4/5] bg-[#7C9E87] rounded-3xl opacity-30"></div>
            <div className="absolute top-3 left-3 w-full aspect-[4/5] bg-[#C4622D] rounded-3xl opacity-20"></div>
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#F5F0E8]">
              <img
                src="/handcrafted-hero.webp"
                alt="Colorful handcrafted guitars hanging in a row"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#3D2B1F] to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white font-bold text-base sm:text-lg">
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
        </div>
      </section>

      {/* Featured Categories Section */}
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">
            Shop by Category
          </h2>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center p-8 bg-[#F5F0E8] rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1 border-b-4 border-[#7C9E87]"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg border-4 border-[#FDFAF6] mb-4">
                <img
                  src={category.image_url}
                  alt={category.image_alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-[#3D2B1F] mb-2">
                {category.name}
              </h3>
              <p className="text-center text-[#3D2B1F] opacity-70">
                {category.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-6 md:px-8 py-16 bg-[#F5F0E8]">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#3D2B1F] mb-4">
            Featured Products
          </h2>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-[#FDFAF6] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="h-48 border-b-4 border-[#7C9E87]">
                <img
                  src={product.image_url}
                  alt={product.image_alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-[#3D2B1F] mb-1">
                  {product.title}
                </h3>
                <p className="text-[#7C9E87] text-sm mb-2">
                  by {product.seller_name}
                </p>
                <div className="text-sm text-[#C4622D] mb-3">
                  ⭐⭐⭐⭐⭐{" "}
                  <span className="text-[#3D2B1F] opacity-60">
                    (24 reviews)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#C4622D]">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <button className="px-4 py-2 bg-[#C4622D] text-white rounded-full text-sm hover:bg-[#3D2B1F] transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}
