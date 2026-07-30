"use server";

import { Category } from "@/app/lib/types";
import { getDb } from "@/app/lib/db";

export async function getCategories(): Promise<Category[]> {
  try {
    const db = getDb();
    const dataQuery = `
      SELECT id, name, image_url, image_alt, description, created_at 
      FROM categories 
      ORDER BY id ASC
    `;

    const dataResult = await db.query<Category>(dataQuery);
    return dataResult.rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to load categories.");
  }
}
