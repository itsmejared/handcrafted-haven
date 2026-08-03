import AddToCartButton from "@/app/ui/add-to-cart-button";
import Pagination from "@/app/ui/pagination";
import Link from "next/link";
import { getProducts } from "@/app/services/products";
import { getCategories } from "@/app/services/categories";

interface ShopPageProps {
  searchParams?: Promise<{
    product?: string;
    category_id?: string;
    min_price?: string;
    max_price?: string;
    sort?: "price-low" | "price-high" | "newest" | "oldest";
    page?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams?.page) || 1;
  const limit = 6;

  const [categories, { data: products, pagination }] = await Promise.all([
    getCategories(),
    getProducts({
      product: resolvedParams?.product,
      category_id: resolvedParams?.category_id
        ? Number(resolvedParams.category_id)
        : undefined,
      min_price: resolvedParams?.min_price
        ? Number(resolvedParams.min_price)
        : undefined,
      max_price: resolvedParams?.max_price
        ? Number(resolvedParams.max_price)
        : undefined,
      sort: resolvedParams?.sort || "newest",
      page,
      limit,
    }),
  ]);

  return (
    <main className="min-h-screen flex flex-col bg-[#FAF7F2] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <div className="mb-8 border-b border-[#E5DEC9] pb-4">
        <h1 className="text-3xl font-bold text-[#2C3E35]">Shop All Products</h1>
        <p className="text-sm text-[#5C6F64] mt-1">
          Showing {products.length} of {pagination.total} handcrafted treasures
        </p>
      </div>

      <form
        action="/shop"
        method="GET"
        className="bg-[#F5F0E8] p-6 rounded-2xl shadow-sm border border-[#E5DEC9] mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
      >
        <div>
          <label
            htmlFor="product"
            className="block text-xs font-semibold text-[#2C3E35] mb-1 uppercase tracking-wider"
          >
            Search
          </label>
          <input
            type="text"
            id="product"
            name="product"
            defaultValue={resolvedParams?.product || ""}
            placeholder="Search items..."
            className="w-full px-3 py-2 rounded-lg border border-[#D1C7BD] bg-white text-sm text-[#2C3E35] focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
          />
        </div>

        <div>
          <label
            htmlFor="category_id"
            className="block text-xs font-semibold text-[#2C3E35] mb-1 uppercase tracking-wider"
          >
            Category
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={resolvedParams?.category_id || ""}
            className="w-full px-3 py-2 rounded-lg border border-[#D1C7BD] bg-white text-sm text-[#2C3E35] focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <div className="w-1/2">
            <label
              htmlFor="min_price"
              className="block text-xs font-semibold text-[#2C3E35] mb-1 uppercase tracking-wider"
            >
              Min ($)
            </label>
            <input
              type="number"
              id="min_price"
              name="min_price"
              min="0"
              step="any"
              defaultValue={resolvedParams?.min_price || ""}
              placeholder="0"
              className="w-full px-3 py-2 rounded-lg border border-[#D1C7BD] bg-white text-sm text-[#2C3E35] focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="max_price"
              className="block text-xs font-semibold text-[#2C3E35] mb-1 uppercase tracking-wider"
            >
              Max ($)
            </label>
            <input
              type="number"
              id="max_price"
              name="max_price"
              min="0"
              step="any"
              defaultValue={resolvedParams?.max_price || ""}
              placeholder="Max"
              className="w-full px-3 py-2 rounded-lg border border-[#D1C7BD] bg-white text-sm text-[#2C3E35] focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="sort"
            className="block text-xs font-semibold text-[#2C3E35] mb-1 uppercase tracking-wider"
          >
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            defaultValue={resolvedParams?.sort || "newest"}
            className="w-full px-3 py-2 rounded-lg border border-[#D1C7BD] bg-white text-sm text-[#2C3E35] focus:outline-none focus:ring-2 focus:ring-[#7C9E87]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-[#7C9E87] text-white font-medium text-sm rounded-lg hover:bg-[#62836C] transition-colors shadow-sm"
          >
            Filter
          </button>
          <Link
            href="/shop"
            className="px-3 py-2 bg-gray-200 text-[#2C3E35] font-medium text-sm rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
          >
            Reset
          </Link>
        </div>
      </form>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-[#F5F0E8] rounded-2xl border border-dashed border-[#7C9E87]">
          <p className="text-lg font-medium text-[#2C3E35]">
            No products found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const roundedRating = Math.round(product.rating_average);
            const stars =
              "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);

            return (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group bg-[#F5F0E8] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="w-full h-48 overflow-hidden bg-gray-200">
                    <img
                      src={product.image_url}
                      alt={product.image_alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-semibold text-[#7C9E87] uppercase tracking-wider">
                      {product.category_name}
                    </span>
                    <h2 className="text-lg font-bold text-[#2C3E35] mt-1 line-clamp-1">
                      {product.title}
                    </h2>
                    <p className="text-xs text-[#5C6F64] mb-2">
                      by {product.seller_name}
                    </p>

                    <div className="flex items-center gap-1 text-sm text-amber-500 mb-3">
                      <span>{stars}</span>
                      <span className="text-xs text-[#5C6F64] ml-1">
                        ({product.reviews_count}{" "}
                        {product.reviews_count === 1 ? "review" : "reviews"})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between mt-auto">
                  <span className="text-lg font-extrabold text-[#2C3E35]">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <AddToCartButton
                    id={product.id}
                    name={product.title}
                    price={Number(product.price)}
                    image={product.image_url}
                    seller={product.seller_name}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
      <Pagination totalPages={pagination.totalPages} />
    </main>
  );
}
