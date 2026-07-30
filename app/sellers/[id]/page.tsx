import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { getDb } from "@/app/lib/db";
import AddToCartButton from "@/app/ui/add-to-cart-button";

interface SellerProfile {
  id: string;
  name: string;
  bio: string | null;
  profile_image_url: string | null;
}

interface SellerProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
  image_alt: string;
  category_name: string;
}

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let seller: SellerProfile | null = null;
  let products: SellerProduct[] = [];

  try {
    const db = getDb();
    const result = await db.query(
      `SELECT id, name, bio, profile_image_url FROM users WHERE id = $1 AND role = 'seller'`,
      [id]
    );
    seller = result.rows[0] || null;

    if (seller) {
      const productsResult = await db.query(
        `SELECT p.id, p.title, p.price, p.image_url, p.image_alt, c.name AS category_name
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.seller_id = $1
         ORDER BY p.created_at DESC`,
        [id]
      );
      products = productsResult.rows;
    }
  } catch (error) {
    console.error("Database error on seller profile page:", error);
  }

  if (!seller) {
    notFound();
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FDFAF6] mx-auto mb-6 bg-[#E8DFD3]">
            {seller.profile_image_url ? (
              <img
                src={seller.profile_image_url}
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7C9E87]">
                No photo yet
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-2">{seller.name}</h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg leading-relaxed">
            {seller.bio || "This seller has not written a bio yet."}
          </p>
        </div>
      </section>

      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#3D2B1F] mb-4">
            Products by {seller.name}
          </h2>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-[#3D2B1F] opacity-70">
            This seller hasn&apos;t listed any products yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="block bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
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
                  <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">
                    {product.category_name}
                  </span>
                  <h3 className="text-lg font-bold text-[#3D2B1F] mt-1 mb-3">
                    {product.title}
                  </h3>
                  <span className="text-xl font-bold text-[#C4622D]">
                    ${Number(product.price).toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
