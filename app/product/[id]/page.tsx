import Link from "next/link";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { getDb } from "@/app/lib/db";
import AddToCartButton from "@/app/ui/add-to-cart-button";

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  image_alt: string;
  seller_name: string;
  seller_email: string;
  category_name: string;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let product: ProductDetail | null = null;

  try {
    const db = getDb();
    const result = await db.query(
      `SELECT p.id, p.title, p.description, p.price, p.image_url, p.image_alt,
              u.name AS seller_name, u.email AS seller_email,
              c.name AS category_name
       FROM products p
       JOIN users u ON p.seller_id = u.id
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = $1`,
      [id]
    );
    product = result.rows[0] || null;
  } catch (error) {
    console.error("Database error on product detail page:", error);
  }

  if (!product) {
    return (
      <main>
        <Header />
        <section className="px-6 md:px-12 py-24 bg-[#F5F0E8] min-h-[60vh] text-center">
          <p className="text-[#3D2B1F] opacity-75 text-lg mb-6">
            This product could not be found.
          </p>
          <Link href="/shop" className="text-[#C4622D] hover:underline">
            Back to shop
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[70vh]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-[#7C9E87]">
            <img
              src={product.image_url}
              alt={product.image_alt}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">
              {product.category_name}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mt-2 mb-3">
              {product.title}
            </h1>
            <p className="text-[#7C9E87] text-sm mb-1">by {product.seller_name}</p>
            <a
              href={`mailto:${product.seller_email}`}
              className="text-xs text-[#C4622D] hover:underline"
            >
              Contact seller
            </a>
            <p className="text-3xl font-bold text-[#C4622D] mt-6 mb-6">
              ${Number(product.price).toFixed(2)}
            </p>
            <p className="text-[#3D2B1F] opacity-80 leading-relaxed mb-8 whitespace-pre-line">
              {product.description}
            </p>
            <AddToCartButton
              name={product.title}
              price={Number(product.price)}
              image={product.image_url}
              seller={product.seller_name}
            />
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
