'use client';

import { useState } from 'react';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { Search } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Searching for:', query);
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
      </section>
      <Footer />
    </main>
  );
}
