import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { User } from "@/app/lib/types";

// GET: Fetch all public artisan profiles (sellers)
export async function GET() {
  try {
    const db = getDb();

    const queryText = `
      SELECT id, name, email, bio, profile_image_url, role, created_at 
      FROM users 
      WHERE role = 'seller'
      ORDER BY name ASC
    `;

    const result = await db.query(queryText);
    const sellers = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      bio: row.bio,
      profileImageUrl: row.profile_image_url,
      profile_image_url: row.profile_image_url,
      role: "artisan",
      createdAt: row.created_at,
      created_at: row.created_at
    }));

    return NextResponse.json(sellers, { status: 200 });
  } catch (error: any) {
    console.error("API Error while fetching sellers storefront list:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading the artisan profiles." },
      { status: 500 }
    );
  }
}
