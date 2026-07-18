import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { Product } from "@/app/lib/types";

export async function GET(request: Request) {
  try {
    const db = getDb();

    // Extract optional query parameters for filtering
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("category_id");

    let queryText = "SELECT * FROM products";
    const queryParams: any[] = [];

    if (categoryId) {
      queryText += " WHERE category_id = $1";
      queryParams.push(parseInt(categoryId, 10));
    }

    queryText += " ORDER BY created_at DESC";

    const result = await db.query(queryText, queryParams);
    const products: Product[] = result.rows;

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("API Error while fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading products." },
      { status: 500 },
    );
  }
}
