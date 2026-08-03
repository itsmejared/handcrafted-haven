import { auth } from "@/auth";
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
  const { id } = await params;

  const [categories, product] = await Promise.all([
    getCategories(),
    getProductById(id),
  ]);

  const session = await auth();

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <ProductForm
        initialData={product}
        categories={categories}
        sellerId={session!.user.id}
      />
    </main>
  );
}
