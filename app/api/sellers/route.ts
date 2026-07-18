import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { User } from "@/app/lib/types";

export async function GET() {
  try {
    const db = getDb();

    // Fetch the single main artisan profile deployed in the database
    const queryText = `
      SELECT id, name, email, bio, profile_image_url, role, created_at 
      FROM users 
      WHERE role = 'seller' 
      LIMIT 1
    `;

    const result = await db.query(queryText);
    const seller: User | null = result.rows[0] || null;

    if (!seller) {
      return NextResponse.json(
        { error: "No artisan profile found in the database." },
        { status: 404 },
      );
    }

    return NextResponse.json(seller, { status: 200 });
  } catch (error) {
    console.error("API Error while fetching seller profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading the artisan profile." },
      { status: 500 },
    );
  }
}
