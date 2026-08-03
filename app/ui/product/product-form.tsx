"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ProductDetails, Category } from "@/app/lib/types";
import { createProduct, updateProduct } from "@/app/services/products";

interface ProductFormProps {
  initialData?: ProductDetails | null;
  categories: Category[];
}

export default function ProductForm({
  initialData,
  categories,
}: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  const [price, setPrice] = useState<string>(
    initialData?.price ? Number(initialData.price).toFixed(2) : "",
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image_url || null,
  );
  const [imageBase64, setImageBase64] = useState<string>(
    initialData?.image_url || "",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Formatea el precio a 2 decimales en el evento onBlur
  const handlePriceBlur = () => {
    if (price && !isNaN(Number(price))) {
      const formatted = Math.max(0, Number(price)).toFixed(2);
      setPrice(formatted);
    }
  };

  // Convierte la imagen seleccionada a Base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // Límite de 2MB
        setErrorMessage("Image size must be less than 2MB.");
        return;
      }
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setImageBase64(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Eliminar la imagen seleccionada
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageBase64("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);

    // TODO: Reemplazar por el ID dinámico del vendedor autenticado
    const mockSellerId = "41e9c845-1238-4272-9749-98b160268f91";

    // Preparamos el objeto JSON que tu backend/Zod requiere
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      price: Number(price),
      category_id: Number(formData.get("category_id")),
      image_url: imageBase64,
      image_alt:
        (formData.get("image_alt") as string) ||
        (formData.get("title") as string),
    };

    try {
      // Invocamos la Server Action respetando sus parámetros
      const result =
        isEditing && initialData?.id
          ? await updateProduct(initialData.id, mockSellerId, rawData)
          : await createProduct(mockSellerId, rawData);

      if (!result.success) {
        setErrorMessage(result.error || "Failed to save product.");
        return;
      }

      // Redireccionamos a la lista de productos
      router.push("/product");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#E5DCCF] max-w-2xl mx-auto space-y-6"
    >
      <div className="border-b border-[#E5DCCF] pb-4">
        <h2 className="text-2xl font-serif font-bold text-[#3D2B1F]">
          {isEditing ? "Edit Product Listing" : "Create New Product Listing"}
        </h2>
        <p className="text-sm text-[#3D2B1F]/70">
          {isEditing
            ? "Update the details of your handcrafted product."
            : "Fill in the information below to add a new item to your showcase."}
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Product Name */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-[#3D2B1F] mb-1"
        >
          Product Name <span className="text-[#C4622D]">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={initialData?.title || ""}
          required
          placeholder="e.g. Handcrafted Ceramic Mug"
          className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCCF] focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
        />
      </div>

      {/* Category Select & Price */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Category */}
        <div>
          <label
            htmlFor="category_id"
            className="block text-sm font-medium text-[#3D2B1F] mb-1"
          >
            Category <span className="text-[#C4622D]">*</span>
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={initialData?.category_id || ""}
            required
            className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCCF] bg-white focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-[#3D2B1F]"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-[#3D2B1F] mb-1"
          >
            Price ($ USD) <span className="text-[#C4622D]">*</span>
          </label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handlePriceBlur}
            required
            placeholder="0.00"
            className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCCF] focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-[#3D2B1F] mb-1"
        >
          Description <span className="text-[#C4622D]">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initialData?.description || ""}
          required
          placeholder="Describe your item, materials used, dimensions, and craft technique..."
          className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCCF] focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-[#3D2B1F] placeholder-[#3D2B1F]/40 resize-none"
        />
      </div>

      {/* Image Alt Text */}
      <div>
        <label
          htmlFor="image_alt"
          className="block text-sm font-medium text-[#3D2B1F] mb-1"
        >
          Image Accessibility Text (Alt)
        </label>
        <input
          type="text"
          id="image_alt"
          name="image_alt"
          defaultValue={initialData?.image_alt || ""}
          placeholder="e.g. Front view of ceramic mug on wooden table"
          className="w-full px-4 py-2.5 rounded-xl border border-[#E5DCCF] focus:outline-none focus:ring-2 focus:ring-[#C4622D] text-[#3D2B1F] placeholder-[#3D2B1F]/40"
        />
      </div>

      {/* Custom Product Image Control */}
      <div>
        <label className="block text-sm font-medium text-[#3D2B1F] mb-2">
          Product Image <span className="text-[#C4622D]">*</span>
        </label>

        {imagePreview ? (
          /* Preview Mode */
          <div className="relative w-full h-52 bg-[#F5F0E8] rounded-2xl border-2 border-dashed border-[#E5DCCF] flex items-center justify-center overflow-hidden group">
            <Image
              src={imagePreview}
              alt="Product preview"
              fill
              className="object-contain p-2"
            />
            <div className="absolute inset-0 bg-[#3D2B1F]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <label
                htmlFor="product-image-input"
                className="px-4 py-2 bg-white text-[#3D2B1F] text-xs font-semibold rounded-lg cursor-pointer hover:bg-[#F5F0E8] transition-colors"
              >
                Change Image
              </label>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          /* Dropzone / Upload Control */
          <label
            htmlFor="product-image-input"
            className="w-full h-44 rounded-2xl border-2 border-dashed border-[#C4622D]/40 bg-[#F5F0E8]/40 hover:bg-[#F5F0E8] transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center group"
          >
            <svg
              className="w-8 h-8 text-[#C4622D] mb-2 group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm font-medium text-[#3D2B1F]">
              Click or drag to upload image
            </span>
            <span className="text-xs text-[#3D2B1F]/60 mt-1">
              PNG, JPG, or WEBP (Max. 2MB)
            </span>
          </label>
        )}

        <input
          id="product-image-input"
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      {/* Buttons */}
      <div className="pt-4 border-t border-[#E5DCCF] flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl border border-[#E5DCCF] text-[#3D2B1F] text-sm font-medium hover:bg-[#F5F0E8] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !imageBase64}
          className="px-6 py-2.5 bg-[#C4622D] text-white rounded-xl text-sm font-medium hover:bg-[#3D2B1F] transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : isEditing
              ? "Update Product"
              : "Save Product"}
        </button>
      </div>
    </form>
  );
}
