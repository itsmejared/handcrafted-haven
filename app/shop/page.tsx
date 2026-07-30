import Link from "next/link";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { getDb } from "@/app/lib/db";
import AddToCartButton from "@/app/ui/add-to-cart-button";
import ShopSearchFilter from "@/app/ui/shop-search-filter";

interface ShopProduct {
  id: string;
  title: string;
  price: number;
  image_url: string;
  image_alt: string;
  seller_name: string;
  category_name: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { category, search, minPrice, maxPrice } = await searchParams;
  let products: ShopProduct[] = [];

  try {
    const db = getDb();
    const baseQuery = `
      SELECT p.id, p.title, p.price, p.image_url, p.image_alt,
             u.name AS seller_name, c.name AS category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
    `;

    const whereClauses: string[] = [];
    const queryParams: any[] = [];

    if (category) {
      queryParams.push(category);
      whereClauses.push(`c.id = $${queryParams.length}`);
    }
    if (search) {
      queryParams.push(`%${search}%`);
      whereClauses.push(`(p.title ILIKE $${queryParams.length} OR p.description ILIKE $${queryParams.length})`);
    }
    if (minPrice) {
      queryParams.push(parseFloat(minPrice));
      whereClauses.push(`p.price >= $${queryParams.length}`);
    }
    if (maxPrice) {
      queryParams.push(parseFloat(maxPrice));
      whereClauses.push(`p.price <= $${queryParams.length}`);
    }

    const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const result = await db.query(
      `${baseQuery} ${whereSQL} ORDER BY p.created_at DESC`,
      queryParams
    );
    products = result.rows;
  } catch (error) {
    console.error("Database error on shop page:", error);
    products = [];
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Shop All Products</h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>

        <ShopSearchFilter />

        {products.length === 0 ? (
          <p className="text-center text-[#3D2B1F] opacity-70">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="h-48 border-b-4 border-[#7C9E87]">
                    <img
                      src={product.image_url}
                      alt={product.image_alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                <div className="p-6">
                  <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">
                    {product.category_name}
                  </span>
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-bold text-[#3D2B1F] mt-1 mb-1 hover:text-[#C4622D] transition-colors">
                      {product.title}
                    </h3>
                  </Link>
                  <p className="text-[#7C9E87] text-sm mb-2">by {product.seller_name}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-[#C4622D]">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    <AddToCartButton
                      name={product.title}
                      price={Number(product.price)}
                      image={product.image_url}
                      seller={product.seller_name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
