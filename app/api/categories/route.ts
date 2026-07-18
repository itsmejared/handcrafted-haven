import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { Category } from "@/app/lib/types";

export async function GET() {
  try {
    const db = getDb();

    // Fetch all categories sorted sequentially
    const result = await db.query("SELECT * FROM categories ORDER BY id ASC");
    const categories: Category[] = result.rows;

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("API Error while fetching categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading categories." },
      { status: 500 },
    );
  }
}
