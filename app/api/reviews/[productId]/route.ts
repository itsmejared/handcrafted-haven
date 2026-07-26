import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
 
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const db = getDb();
 
    const result = await db.query(
      `SELECT
         r.id,
         r.product_id,
         r.user_id,
         r.rating,
         r.comment,
         r.created_at,
         u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [productId]
    );
 
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error("API Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal Server Error while fetching reviews." },
      { status: 500 }
    );
  }
}