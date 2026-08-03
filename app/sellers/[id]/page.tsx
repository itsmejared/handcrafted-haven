import { notFound } from "next/navigation";
import { getDb } from "@/app/lib/db";

interface SellerProfile {
  id: string;
  name: string;
  bio: string | null;
  profile_image_url: string | null;
}

export default async function SellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let seller: SellerProfile | null = null;

  try {
    const db = getDb();
    const result = await db.query(
      `SELECT id, name, bio, profile_image_url FROM users WHERE id = $1 AND role = 'seller'`,
      [id],
    );
    seller = result.rows[0] || null;
  } catch (error) {
    console.error("Database error on seller profile page:", error);
  }

  if (!seller) {
    notFound();
  }

  return (
    <main>
      <section className="px-6 md:px-12 py-16 md:py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-[#FDFAF6] mx-auto mb-6 bg-[#E8DFD3]">
            {seller.profile_image_url ? (
              <img
                src={seller.profile_image_url}
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#7C9E87]">
                No photo yet
              </div>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-2">
            {seller.name}
          </h1>
          <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full mb-6"></div>
          <p className="text-[#3D2B1F] opacity-75 text-lg leading-relaxed">
            {seller.bio || "This seller has not written a bio yet."}
          </p>
        </div>
      </section>
    </main>
  );
}
