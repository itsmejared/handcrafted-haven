'use client';

import { useState } from 'react';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import AddToCartButton from '@/app/ui/add-to-cart-button';
import { Search } from 'lucide-react';

interface SearchProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  image_alt: string;
  seller_name: string;
  category_name: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const res = await fetch(`/api/products?search=${encodeURIComponent(query.trim())}`);

      if (!res.ok) {
        throw new Error('Failed to fetch search results.');
      }

      const data: SearchProduct[] = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Something went wrong while searching. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 md:py-24 bg-[#F5F0E8] min-h-[50vh]">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Search Products</h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-8"></div>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for handmade jewelry, decor, and more..."
              className="w-full py-4 pl-6 pr-14 rounded-full border-2 border-[#7C9E87] text-[#3D2B1F] placeholder:text-[#3D2B1F]/50 focus:outline-none focus:border-[#C4622D] transition-colors"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#C4622D] text-white p-3 rounded-full hover:bg-[#3D2B1F] transition-colors"
              aria-label="Submit search"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="max-w-5xl mx-auto mt-16">
          {loading && (
            <p className="text-center text-[#3D2B1F] opacity-75 text-lg">Searching...</p>
          )}

          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!loading && !error && searched && results.length === 0 && (
            <p className="text-center text-[#3D2B1F] opacity-75 text-lg">
              No products found for &ldquo;{query}&rdquo;. Try a different keyword.
            </p>
          )}

          {!loading && results.length > 0 && (
            <>
              <p className="text-center text-[#3D2B1F] opacity-75 mb-8">
                {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {results.map((product) => (
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
                      <span className="text-xs uppercase tracking-wide text-[#7C9E87] font-semibold">
                        {product.category_name}
                      </span>
                      <h3 className="text-lg font-bold text-[#3D2B1F] mt-1 mb-1">{product.title}</h3>
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
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}



