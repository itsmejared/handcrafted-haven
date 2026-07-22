import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { products } from '@/app/lib/data';
import AddToCartButton from '@/app/ui/add-to-cart-button';

export default function ShopPage() {
  return (
    <main>
      <Header />
      <section className="px-6 md:px-8 py-16 bg-[#FDFAF6]">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Shop All Products</h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <div
              key={product.name}
              className="bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="h-48 border-b-4 border-[#7C9E87]">
                <img
                  src={product.image}
                  alt={product.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">{product.category}</span>
                <h3 className="text-lg font-bold text-[#3D2B1F] mt-1 mb-1">{product.name}</h3>
                <p className="text-[#7C9E87] text-sm mb-2">by {product.seller}</p>
                <div className="text-sm text-[#C4622D] mb-3">⭐⭐⭐⭐⭐ <span className="text-[#3D2B1F] opacity-60">(24 reviews)</span></div>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#C4622D]">{product.price}</span>
                  <AddToCartButton
                    name={product.name}
                    price={Number(product.price.replace('$', ''))}
                    image={product.image}
                    seller={product.seller}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
