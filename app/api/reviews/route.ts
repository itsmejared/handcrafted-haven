import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { getAuthenticatedUser } from "@/app/lib/auth";
 
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
 
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to leave a review." },
        { status: 401 }
      );
    }
 
    const body = await request.json();
    const { product_id, rating, comment } = body;
 
    if (!product_id || !rating) {
      return NextResponse.json(
        { error: "product_id and rating are required." },
        { status: 400 }
      );
    }
 
    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }
 
    const db = getDb();
 
    const productCheck = await db.query(
      `SELECT id FROM products WHERE id = $1`,
      [product_id]
    );
    if (productCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }
 
    const result = await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, product_id, user_id, rating, comment, created_at`,
      [product_id, user.id, ratingNum, comment ? comment.trim() : null]
    );
 
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("API Error creating review:", error);
    return NextResponse.json(
      { error: "Internal Server Error while creating review." },
      { status: 500 }
    );
  }
}