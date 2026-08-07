import { getDb } from "@/app/lib/db";
import { reviewSchema } from "@/app/lib/validations/review";
import { Review, ProductReview } from "@/app/lib/types";
import { revalidatePath } from "next/cache";

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

export interface PaginatedReviewProducts {
  data: ProductReview[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Get products with different statuses to review.
export async function getUserReviewProducts(
  userId: string,
  statusFilter: "all" | "pending" | "reviewed" = "all",
  searchTerm: string = "",
  page: number = 1,
  limit: number = 6,
): Promise<PaginatedReviewProducts> {
  try {
    const db = getDb();
    const queryParams: any[] = [userId];
    let whereClause = `WHERE p.seller_id != $1`;

    if (searchTerm.trim().length > 0) {
      queryParams.push(`%${searchTerm.trim()}%`);
      whereClause += ` AND (p.title ILIKE $${queryParams.length} OR c.name ILIKE $${queryParams.length})`;
    }

    if (statusFilter === "pending") {
      whereClause += ` AND r.id IS NULL`;
    } else if (statusFilter === "reviewed") {
      whereClause += ` AND r.id IS NOT NULL`;
    }

    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int AS total
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.user_id = $1
      ${whereClause};
    `;
    const countResult = await db.query(countQuery, queryParams);
    const total = countResult.rows[0]?.total || 0;

    const offset = (page - 1) * limit;
    queryParams.push(limit, offset);

    const dataQuery = `
      SELECT 
        p.id AS product_id,
        p.title AS product_title,
        p.image_url AS product_image,
        c.name AS category_name,
        u.name AS seller_name,
        r.id AS id,
        r.rating,
        r.comment,
        r.created_at AS review_date,
        (r.id IS NOT NULL) AS has_reviewed
      FROM products p
      JOIN categories c ON p.category_id = c.id
      JOIN users u ON p.seller_id = u.id
      LEFT JOIN reviews r ON p.id = r.product_id AND r.user_id = $1
      ${whereClause}
      ORDER BY r.created_at DESC NULLS LAST, p.created_at DESC
      LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length};
    `;

    const dataResult = await db.query(dataQuery, queryParams);

    return {
      data: dataResult.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error) {
    console.error("Error fetching user review products:", error);
    return {
      data: [],
      pagination: {
        total: 0,
        page,
        limit,
        totalPages: 1,
      },
    };
  }
}

// Upsert review
export async function upsertReview(
  userId: string,
  data: { userId: string; productId: string; rating: number; comment?: string },
) {
  try {
    const validatedData = reviewSchema.parse(data);
    const db = getDb();

    const queryText = `
      INSERT INTO reviews (product_id, user_id, rating, comment, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET 
        rating = EXCLUDED.rating,
        comment = EXCLUDED.comment,
        created_at = NOW()
      RETURNING id;
    `;

    await db.query(queryText, [
      validatedData.productId,
      userId,
      validatedData.rating,
      validatedData.comment || null,
    ]);

    revalidatePath("/reviews");
    revalidatePath(`/products/${data.productId}`);
    revalidatePath("/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error: any) {
    console.error("Error in upsertReview:", error);
    return { success: false, error: error.message || "Failed to save review." };
  }
}

// Delete review
export async function deleteReview(reviewId: string, userId: string) {
  try {
    const db = getDb();
    await db.query(`DELETE FROM reviews WHERE id = $1 AND user_id = $2`, [
      reviewId,
      userId,
    ]);

    revalidatePath("/reviews");
    revalidatePath("/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteReview:", error);
    return { success: false, error: "Failed to delete review." };
  }
}
