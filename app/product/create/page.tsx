import { auth } from "@/auth";
import ProductForm from "@/app/ui/product/product-form";
import { getCategories } from "@/app/services/categories";

export default async function NewProductPage() {
  const categories = await getCategories();
  const session = await auth();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <ProductForm categories={categories} sellerId={session!.user.id} />
    </main>
  );
}
