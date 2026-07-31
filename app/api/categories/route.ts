import { NextResponse } from "next/server";
import { getCategories } from "@/app/services/categories";

// GET: Fetch all categories (used by client components, e.g. the
// product-listing form's category dropdown, which can't call the
// server-only getCategories() service directly).
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (error: unknown) {
    console.error("API Error while fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading categories." },
      { status: 500 },
    );
  }
}