'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import AddToCartButton from '@/app/ui/add-to-cart-button';

interface ProductImage {
  id: string;
  imageUrl: string;
  imageAlt: string;
  displayOrder: number;
}

interface ProductDetail {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  imageAlt: string;
  sellerName: string;
  sellerBio: string | null;
  categoryName: string;
  images: ProductImage[];
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (res.status === 404) {
          setError('This product could not be found.');
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to load product.');
        }
        const data: ProductDetail = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Something went wrong while loading this product. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      loadProduct();
    }
  }, [params.id]);

  // Fall back to the product's primary image if no product_images rows exist yet
  const gallery: ProductImage[] =
    product && product.images.length > 0
      ? product.images
      : product
      ? [{ id: 'primary', imageUrl: product.imageUrl, imageAlt: product.imageAlt, displayOrder: 0 }]
      : [];

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[70vh]">
        {loading && (
          <p className="text-center text-[#3D2B1F] opacity-75 text-lg">Loading product...</p>
        )}

        {!loading && error && (
          <p className="text-center text-red-500 text-lg">{error}</p>
        )}

        {!loading && !error && product && (
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {/* Image gallery */}
            <div>
              <div className="w-full aspect-square rounded-2xl overflow-hidden border-4 border-[#7C9E87] mb-4">
                <img
                  src={gallery[activeImageIndex]?.imageUrl}
                  alt={gallery[activeImageIndex]?.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>

              {gallery.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {gallery.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImageIndex(index)}
                      aria-label={`View image ${index + 1} of ${gallery.length}`}
                      aria-pressed={index === activeImageIndex}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === activeImageIndex ? 'border-[#C4622D]' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.imageAlt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details + purchase */}
            <div>
              <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">
                {product.categoryName}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mt-2 mb-3">
                {product.title}
              </h1>
              <p className="text-[#7C9E87] text-sm mb-6">by {product.sellerName}</p>

              <p className="text-3xl font-bold text-[#C4622D] mb-6">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="text-[#3D2B1F] opacity-80 leading-relaxed mb-8 whitespace-pre-line">
                {product.description}
              </p>

              <AddToCartButton
                name={product.title}
                price={Number(product.price)}
                image={product.imageUrl}
                seller={product.sellerName}
              />

              {product.sellerBio && (
                <div className="mt-10 pt-8 border-t border-[#7C9E87]/30">
                  <h2 className="text-sm font-semibold text-[#3D2B1F] mb-2">
                    About {product.sellerName}
                  </h2>
                  <p className="text-sm text-[#3D2B1F] opacity-70 leading-relaxed">
                    {product.sellerBio}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
      <Footer />
    </main>
  );
}
