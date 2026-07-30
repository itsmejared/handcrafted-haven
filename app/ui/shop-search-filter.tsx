'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

export default function ShopSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState(searchParams.get('search') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) setCategories(await res.json());
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  function applyFilters(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('search', keyword.trim());
    if (categoryId) params.set('category', categoryId);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ''}`);
  }

  function clearFilters() {
    setKeyword('');
    setCategoryId('');
    setMinPrice('');
    setMaxPrice('');
    router.push('/shop');
  }

  const hasActiveFilters = keyword || categoryId || minPrice || maxPrice;

  return (
    <div className="max-w-3xl mx-auto mb-10">
      <div className="flex justify-center">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#7C9E87] text-[#3D2B1F] hover:bg-[#7C9E87] hover:text-white transition-colors"
        >
          <Search size={16} />
          Search All Products
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#C4622D]" aria-label="Filters active" />
          )}
        </button>
      </div>

      {open && (
        <form
          onSubmit={applyFilters}
          className="mt-4 bg-[#FDFAF6] rounded-2xl shadow-md p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <label htmlFor="keyword" className="block text-xs font-medium text-[#3D2B1F]/70 mb-1">
              Name or keyword
            </label>
            <input
              id="keyword"
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. ceramic bowl"
              className="w-full px-4 py-2.5 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D]"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-xs font-medium text-[#3D2B1F]/70 mb-1">
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] bg-white"
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="minPrice" className="block text-xs font-medium text-[#3D2B1F]/70 mb-1">
                Min price
              </label>
              <input
                id="minPrice"
                type="number"
                min="0"
                step="0.01"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="$0"
                className="w-full px-4 py-2.5 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D]"
              />
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-xs font-medium text-[#3D2B1F]/70 mb-1">
                Max price
              </label>
              <input
                id="maxPrice"
                type="number"
                min="0"
                step="0.01"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="$500"
                className="w-full px-4 py-2.5 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D]"
              />
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 px-4 py-2 text-sm text-[#3D2B1F]/70 hover:text-[#C4622D] transition-colors"
              >
                <X size={14} />
                Clear
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C4622D] text-white rounded-full text-sm font-medium hover:bg-[#3D2B1F] transition-colors"
            >
              Apply filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
