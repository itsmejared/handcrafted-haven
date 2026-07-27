'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/ui/header';
import Footer from '@/app/ui/footer';
import { Category } from '@/app/lib/types';

interface ImageEntry {
  imageUrl: string;
  imageAlt: string;
  previewError: boolean;
}

function emptyImageEntry(): ImageEntry {
  return { imageUrl: '', imageAlt: '', previewError: false };
}

export default function NewProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const [images, setImages] = useState<ImageEntry[]>([emptyImageEntry()]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Failed to load categories.');
        const data: Category[] = await res.json();
        setCategories(data);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Could not load categories. Please refresh the page.');
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function updateImageField(index: number, field: 'imageUrl' | 'imageAlt', value: string) {
    setImages((prev) =>
      prev.map((img, i) => {
        if (i !== index) return img;
        const updated = { ...img, [field]: value };
        if (field === 'imageUrl') {
          updated.previewError = false;
        }
        return updated;
      })
    );
  }

  function handleImagePreviewError(index: number) {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, previewError: true } : img))
    );
  }

  function addImageField() {
    setImages((prev) => [...prev, emptyImageEntry()]);
  }

  function removeImageField(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const validImages = images
      .map((img) => ({ imageUrl: img.imageUrl.trim(), imageAlt: img.imageAlt.trim() }))
      .filter((img) => img.imageUrl.length > 0);

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.price ||
      !formData.categoryId ||
      validImages.length === 0
    ) {
      setError('Please fill in title, description, price, category, and at least one image URL.');
      return;
    }

    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          price: parsedPrice,
          categoryId: parseInt(formData.categoryId, 10),
          images: validImages.map((img) => ({
            imageUrl: img.imageUrl,
            imageAlt: img.imageAlt || formData.title.trim(),
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create product listing.');
        setSubmitting(false);
        return;
      }

      router.push(`/product/${data.id}`);
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <main>
      <Header />
      <section className="px-6 md:px-12 py-16 bg-[#F5F0E8] min-h-[60vh]">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-[#3D2B1F] mb-4">
              List a New Product
            </h1>
            <div className="w-24 h-1 bg-[#7C9E87] mx-auto rounded-full"></div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#FDFAF6] rounded-2xl p-6 md:p-8 shadow-md space-y-5"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Product Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Hand-thrown Ceramic Bowl"
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your product, materials, and what makes it unique..."
                className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                  Price ($)
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="45.00"
                  className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-[#3D2B1F] mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors bg-white"
                >
                  <option value="" disabled>
                    {loadingCategories ? 'Loading...' : 'Select a category'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Multi-image fields */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#3D2B1F]">
                Product Images
              </label>

              {images.map((img, index) => (
                <div
                  key={index}
                  className="border border-[#7C9E87]/40 rounded-md p-4 space-y-3 relative"
                >
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute top-3 right-3 text-[#3D2B1F]/50 hover:text-[#C4622D] transition-colors"
                    >
                      ✕
                    </button>
                  )}

                  <div>
                    <label
                      htmlFor={`imageUrl-${index}`}
                      className="block text-xs font-medium text-[#3D2B1F]/70 mb-1"
                    >
                      {index === 0 ? 'Primary Image URL' : `Image ${index + 1} URL`}
                    </label>
                    <input
                      id={`imageUrl-${index}`}
                      type="url"
                      required={index === 0}
                      value={img.imageUrl}
                      onChange={(e) => updateImageField(index, 'imageUrl', e.target.value)}
                      placeholder="https://example.com/my-product.webp"
                      className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={`imageAlt-${index}`}
                      className="block text-xs font-medium text-[#3D2B1F]/70 mb-1"
                    >
                      Alt Text <span className="opacity-50">(optional)</span>
                    </label>
                    <input
                      id={`imageAlt-${index}`}
                      type="text"
                      value={img.imageAlt}
                      onChange={(e) => updateImageField(index, 'imageAlt', e.target.value)}
                      placeholder="Describes the image for accessibility"
                      className="w-full px-4 py-3 rounded-md border border-[#7C9E87]/40 focus:outline-none focus:border-[#C4622D] transition-colors"
                    />
                  </div>

                  {img.imageUrl && !img.previewError && (
                    <div className="w-full h-40 rounded-md overflow-hidden border border-[#7C9E87]/40">
                      <img
                        src={img.imageUrl}
                        alt="Preview"
                        onError={() => handleImagePreviewError(index)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addImageField}
                className="text-sm font-medium text-[#C4622D] hover:text-[#3D2B1F] transition-colors"
              >
                + Add another image
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#C4622D] text-white rounded-full text-lg font-medium hover:bg-[#3D2B1F] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Listing Product...' : 'List Product'}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}