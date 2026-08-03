import { notFound } from "next/navigation";
import { getCategories } from "@/app/services/categories";
import { getProductById } from "@/app/services/products";
import ProductForm from "@/app/ui/product/product-form";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // Desestructuramos la promesa de params requerida en Next.js 15+
  const { id } = await params;

  // Ejecutamos ambas consultas al mismo tiempo en el servidor
  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  // Si el producto no existe en la base de datos, mostramos la vista 404
  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <ProductForm initialData={product} categories={categories} />
    </main>
  );
}
