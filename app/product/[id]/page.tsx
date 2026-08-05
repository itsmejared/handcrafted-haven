import { getProductById } from "@/app/services/products";
import AddToCartButton from "@/app/ui/add-to-cart-button";
import { notFound } from "next/navigation";
import { getReviewsByProductId } from "@/app/services/reviews";
import ProductReviewsCarousel from "@/app/ui/product/product-reviews-carousel";
import Image from "next/image";
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;

  const [product, reviews] = await Promise.all([
    getProductById(id),
    getReviewsByProductId(id),
  ]);

  if (!product) {
    notFound();
  }

  const roundedRating = Math.round(product.rating_average || 0);
  const stars = "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);

  return (
    <main>
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[70vh]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <div>
          <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-[#7C9E87] shadow-sm relative">
            <Image
              src={product.image_url}
              alt={product.image_alt || product.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">
                {product.category_name}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mt-2 mb-2">
                {product.title}
              </h1>

              <p className="text-[#7C9E87] text-sm mb-3">
                by{" "}
                <span className="font-semibold text-[#3D2B1F]">
                  {product.seller_name}
                </span>
              </p>

              <div className="flex items-center gap-1 text-sm text-amber-500 mb-6">
                <span>{stars}</span>
                <span className="text-xs text-[#5C6F64] ml-1">
                  ({product.reviews_count}{" "}
                  {product.reviews_count === 1 ? "review" : "reviews"})
                </span>
              </div>

              <p className="text-3xl font-bold text-[#C4622D] mb-6">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="text-[#3D2B1F] opacity-80 leading-relaxed mb-8 whitespace-pre-line text-sm md:text-base">
                {product.description}
              </p>

              <AddToCartButton
                id={product.id}
                name={product.title}
                price={Number(product.price)}
                image={product.image_url}
                seller={product.seller_name}
              />
              <ProductReviewsCarousel reviews={reviews} />
            </div>

            {product.seller_bio && (
              <div className="mt-10 pt-6 border-t border-[#7C9E87]/30">
                <div className="flex items-center gap-3 mb-3">
                <Image
                  src={product.seller_image || "/images/default-avatar.png"}
                  alt={product.seller_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#7C9E87]"
                />
                  <div>
                    <h2 className="text-sm font-semibold text-[#3D2B1F]">
                      About {product.seller_name}
                    </h2>
                    <span className="text-xs text-[#3D2B1F]/60">
                      Artisan / Seller
                    </span>
                  </div>
                </div>
                <p className="text-sm text-[#3D2B1F] opacity-70 leading-relaxed">
                  {product.seller_bio || "No biography provided yet."}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
