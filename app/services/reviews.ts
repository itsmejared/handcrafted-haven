import { getDb } from "@/app/lib/db";
import { Review } from "@/app/lib/types";

export async function getReviewsByProductId(
  productId: string,
): Promise<Review[]> {
  try {
    const db = getDb();

    const queryText = `
      SELECT 
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
      ORDER BY r.created_at DESC;
    `;

    const result = await db.query(queryText, [productId]);
    return result.rows as Review[];
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    return [];
  }
}
