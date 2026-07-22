'use client';

import { useState, use } from 'react';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { sellers } from '@/app/lib/data';
import { notFound } from 'next/navigation';

export default function EditSellerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const seller = sellers.find((s) => s.id === id);

  if (!seller) {
    notFound();
  }

  const [formData, setFormData] = useState({
    name: seller.name,
    craft: seller.craft,
    bio: seller.bio,
  });
  const [imagePreview, setImagePreview] = useState(seller.image);
  const [saved, setSaved] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Will connect to the backend update endpoint once available
    console.log('Updated profile:', formData);
    setSaved(true);
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">Edit Seller Profile</h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#FDFAF6] rounded-2xl p-6 md:p-8 shadow-md space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg border-4 border-[#F5F0E8] mb-3">
                <img src={imagePreview} alt="Profile preview" className="w-full h-full object-cover" />
              </div>
              <label className="text-sm font-medium text-[#3D2B1F] cursor-pointer hover:text-[#C4622D]">
                Upload New Photo
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#3D2B1F] mb-2">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="craft" className="block text-sm font-medium text-[#3D2B1F] mb-2">Craft</label>
              <input
                id="craft"
                name="craft"
                type="text"
                value={formData.craft}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-[#3D2B1F] mb-2">Bio</label>
              <textarea
                id="bio"
                name="bio"
                rows={5}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>

            {saved && (
              <p className="text-center text-[#7C9E87] font-medium">Changes saved locally (backend sync coming soon)!</p>
            )}
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
