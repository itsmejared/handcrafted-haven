import { getDb } from "@/app/lib/db";
import { User } from "@/app/lib/types";
import { revalidatePath } from "next/cache";

export interface SellersQueryParams {
  page?: number;
  limit?: number;
}

export interface PaginatedSellersResponse {
  sellers: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Fetch paginated list of sellers from PostgreSQL
 */
export async function getSellers(
  params: SellersQueryParams = {},
): Promise<PaginatedSellersResponse> {
  try {
    const db = getDb();
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Number(params.limit) || 6);
    const offset = (page - 1) * limit;

    // 1. Get total count of sellers
    const countResult = await db.query(
      `SELECT COUNT(*)::int AS total FROM users WHERE role = 'seller'`,
    );
    const total = countResult.rows[0]?.total || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    // 2. Query paginated sellers
    const queryText = `
      SELECT id, role, name, bio, profile_image_url
      FROM users
      WHERE role = 'seller'
      ORDER BY name ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await db.query(queryText, [limit, offset]);

    return {
      sellers: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  } catch (error) {
    console.error("Error fetching sellers:", error);
    return {
      sellers: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 6,
        totalPages: 1,
      },
    };
  }
}

/**
 * Fetch a single seller by ID
 */
export async function getSellerById(id: string): Promise<User | null> {
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT id, email, role, name, bio, profile_image_url, created_at 
       FROM users 
       WHERE id = $1 AND role = 'seller'`,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error(`Error fetching seller by ID (${id}):`, error);
    return null;
  }
}

export async function updateUserProfile(
  id: string,
  data: {
    bio?: string | null;
    profile_image_url?: string | null;
  },
) {
  try {
    const db = getDb();
    await db.query(
      `UPDATE users 
       SET bio = $1, profile_image_url = $2
       WHERE id = $3`,
      [data.bio || null, data.profile_image_url || null, id],
    );
    revalidatePath("/profile");
    revalidatePath("/sellers");

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Database error updating profile" };
  }
}
