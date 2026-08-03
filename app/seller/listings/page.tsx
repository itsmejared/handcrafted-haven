"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { useAuth } from "@/app/lib/auth-context";
import { useToast } from "@/app/context/toast-context";
import { ProductDetails } from "@/app/lib/types";

export default function MyListingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [listings, setListings] = useState<ProductDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    if (user.role !== "seller") {
      router.push("/");
      return;
    }

    const currentUser = user;

    async function loadListings() {
      setLoading(true);
      setLoadError("");
      try {
        const res = await fetch(`/api/products?seller_id=${currentUser.id}`);
        if (!res.ok) {
          throw new Error("Failed to load your listings.");
        }
        const data: ProductDetails[] = await res.json();
        setListings(data);
      } catch (err) {
        console.error("Error loading listings:", err);
        setLoadError(
          "Something went wrong while loading your listings. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [user, router]);

  async function handleDelete(productId: string) {
    setDeletingId(productId);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to remove this listing.", "error");
        setDeletingId(null);
        setConfirmingId(null);
        return;
      }

      setListings((prev) => prev.filter((p) => p.id !== productId));
      showToast("Listing removed.", "success");
    } catch (err) {
      console.error("Error deleting product:", err);
      showToast(
        "Something went wrong while removing this listing. Please try again.",
        "error",
      );
    } finally {
      setDeletingId(null);
      setConfirmingId(null);
    }
  }

  if (!user) {
    return (
      <main>
        <Header />
        <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[60vh]">
          <p className="text-center text-[#3D2B1F] opacity-75 text-lg">
            Please log in to view your listings.
          </p>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">
              My Listings
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
          </div>

          {loading && (
            <p className="text-center text-[#3D2B1F] opacity-75 text-lg">
              Loading your listings...
            </p>
          )}

          {loadError && (
            <p className="text-center text-red-500 mb-6">{loadError}</p>
          )}

          {!loading && listings.length === 0 && !loadError && (
            <p className="text-center text-[#3D2B1F] opacity-75 text-lg">
              You haven&apos;t listed any products yet.
            </p>
          )}

          {!loading && listings.length > 0 && (
            <div className="space-y-4">
              {listings.map((product) => (
                <div
                  key={product.id}
                  className="bg-[#FDFAF6] rounded-xl shadow-md p-4 flex items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border border-[#7C9E87]/40">
                    <img
                      src={product.image_url}
                      alt={product.image_alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-[#3D2B1F] truncate">
                      {product.title}
                    </h2>
                    <p className="text-sm text-[#7C9E87]">
                      {product.category_name}
                    </p>
                    <p className="text-[#C4622D] font-semibold">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>

                  {confirmingId === product.id ? (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-sm text-[#3D2B1F]">
                        Remove this listing?
                      </span>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        {deletingId === product.id
                          ? "Removing..."
                          : "Yes, remove"}
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
                        disabled={deletingId === product.id}
                        className="px-3 py-1.5 text-[#3D2B1F] text-sm border border-[#7C9E87]/40 rounded-full hover:bg-[#F5F0E8] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmingId(product.id)}
                      className="flex-shrink-0 px-4 py-2 text-red-500 border border-red-500 text-sm rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
