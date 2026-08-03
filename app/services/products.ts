"use server";

import { getDb } from "@/app/lib/db";
import { ProductDetails } from "@/app/lib/types";
import { ProductQueryParams } from "@/app/lib/validations/product";
import { revalidatePath } from "next/cache";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "@/app/lib/validations/product";

const user = { id: "41e9c845-1238-4272-9749-98b160268f91" };

/**
 * Server Action to retrieve filtered and paginated products.
 * Can be called directly from Server Components or Client Components.
 */
export async function getProducts(params: ProductQueryParams) {
  const { category_id, product, min_price, max_price, sort, page, limit } =
    params;

  try {
    const db = getDb();

    let baseJoins = `
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
    `;

    const queryParams: unknown[] = [];
    const whereClauses: string[] = [];

    // Filter by product title or description (case-insensitive)
    if (product && product.trim().length > 0) {
      queryParams.push(`%${product.trim()}%`);
      whereClauses.push(
        `(p.title ILIKE $${queryParams.length} OR p.description ILIKE $${queryParams.length})`,
      );
    }

    // Filter by category_id
    if (category_id !== undefined) {
      queryParams.push(category_id);
      whereClauses.push(`p.category_id = $${queryParams.length}`);
    }

    // Filter by minimum price
    if (min_price !== undefined) {
      queryParams.push(min_price);
      whereClauses.push(`p.price >= $${queryParams.length}`);
    }

    // Filter by maximum price
    if (max_price !== undefined) {
      queryParams.push(max_price);
      whereClauses.push(`p.price <= $${queryParams.length}`);
    }

    let whereClause = "";
    if (whereClauses.length > 0) {
      whereClause = " WHERE " + whereClauses.join(" AND ");
    }

    const countQuery = `SELECT COUNT(*)::int AS total ${baseJoins} ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const total = countResult.rows[0]?.total || 0;

    let orderClause = " ORDER BY p.created_at DESC";
    if (sort === "price-low") {
      orderClause = " ORDER BY p.price ASC";
    } else if (sort === "price-high") {
      orderClause = " ORDER BY p.price DESC";
    } else if (sort === "oldest") {
      orderClause = " ORDER BY p.created_at ASC";
    }

    const offset = (page - 1) * limit;
    const dataQueryParams = [...queryParams, limit, offset];
    const limitParamIndex = queryParams.length + 1;
    const offsetParamIndex = queryParams.length + 2;

    const dataQuery = `
      SELECT p.id, p.title, p.description, p.price, p.image_url, p.image_alt, p.seller_id, p.category_id, p.created_at,
             u.name AS seller_name, 
             c.name AS category_name,
             COUNT(r.id)::int AS reviews_count,
             COALESCE(ROUND(AVG(r.rating), 2), 0)::float AS rating_average
      ${baseJoins}
      LEFT JOIN reviews r ON p.id = r.product_id
      ${whereClause}
      GROUP BY p.id, u.name, c.name
      ${orderClause}
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
    `;

    const dataResult = await db.query(dataQuery, dataQueryParams);

    return {
      data: dataResult.rows as ProductDetails[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error: unknown) {
    console.error("Error in getProducts service:", error);

    // Fallback response to prevent breaking UI components on DB errors
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

export async function getProductById(
  id: string,
): Promise<ProductDetails | null> {
  try {
    const db = getDb();

    const queryText = `
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.price,
        p.image_url, 
        p.image_alt AS "imageAlt",
        p.seller_id, 
        p.category_id, 
        p.created_at,
        u.name AS seller_name, 
        u.bio AS seller_bio, 
        u.profile_image_url AS seller_image,
        c.name AS category_name,
        COALESCE(ROUND(AVG(r.rating), 2), 0)::float AS rating_average,
        COUNT(r.id)::int AS reviews_count
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON r.product_id = p.id
      WHERE p.id = $1
      GROUP BY 
        p.id, 
        u.name, 
        u.bio, 
        u.profile_image_url, 
        c.name;
    `;

    const result = await db.query(queryText, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as ProductDetails;
  } catch (error) {
    console.error(`Error en getProductById para id ${id}:`, error);
    return null;
  }
}

export async function getProductsBySeller(
  sellerId: string,
  page: number = 1,
  limit: number = 10,
) {
  try {
    const db = getDb();

    const countQuery = `
      SELECT COUNT(*)::int AS total 
      FROM products 
      WHERE seller_id = $1
    `;
    const countResult = await db.query(countQuery, [sellerId]);
    const total = countResult.rows[0]?.total || 0;

    const offset = (page - 1) * limit;

    const dataQuery = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.image_url,
        p.image_alt,
        p.seller_id,
        p.category_id,
        p.created_at,
        c.name AS category_name,
        COUNT(r.id)::int AS reviews_count,
        COALESCE(ROUND(AVG(r.rating), 2), 0)::float AS rating_average
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN reviews r ON p.id = r.product_id
      WHERE p.seller_id = $1
      GROUP BY p.id, c.name
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;
    `;

    const dataResult = await db.query(dataQuery, [sellerId, limit, offset]);

    return {
      data: dataResult.rows as ProductDetails[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  } catch (error: unknown) {
    console.error("Error fetching products by seller:", error);
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

export interface ServiceResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode: number;
}

/**
 * Creates a new product using Zod validation.
 */
export async function createProduct(input: unknown): Promise<ServiceResponse> {
  try {
    /*const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
        statusCode: 401,
      };
    }

    if (user.role !== "seller") {
      return {
        success: false,
        error: "Forbidden. Only sellers can list products.",
        statusCode: 403,
      };
    }*/

    // 1. Zod Validation
    const validation = createProductSchema.safeParse(input);
    if (!validation.success) {
      const errorMessage = validation.error.issues[0].message;
      return { success: false, error: errorMessage, statusCode: 400 };
    }

    const { title, description, price, image_url, image_alt, category_id } =
      validation.data;

    const db = getDb();

    // 2. Verify category exists
    const categoryCheck = await db.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id],
    );

    if (categoryCheck.rows.length === 0) {
      return {
        success: false,
        error: "Invalid category_id. Category does not exist.",
        statusCode: 400,
      };
    }

    // 3. Insert product
    const result = await db.query(
      `INSERT INTO products (title, description, price, image_url, image_alt, seller_id, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, price, image_url, image_alt, seller_id, category_id, created_at`,
      [title, description, price, image_url, image_alt, user.id, category_id],
    );

    revalidatePath("/shop");
    revalidatePath("/products");

    return {
      success: true,
      data: result.rows[0],
      statusCode: 201,
    };
  } catch (error: unknown) {
    console.error("Service Error while adding product:", error);
    return {
      success: false,
      error: "Internal Server Error while adding product.",
      statusCode: 500,
    };
  }
}

/**
 * Updates an existing product using Zod validation.
 */
export async function updateProduct(input: unknown): Promise<ServiceResponse> {
  try {
    /*const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
        statusCode: 401,
      };
    }*/

    // 1. Zod Validation
    const validation = updateProductSchema.safeParse(input);
    if (!validation.success) {
      const errorMessage = validation.error.issues[0].message;
      return { success: false, error: errorMessage, statusCode: 400 };
    }

    const { id, title, description, price, image_url, image_alt, category_id } =
      validation.data;

    const db = getDb();

    // 2. Verify ownership
    const productCheck = await db.query(
      "SELECT seller_id FROM products WHERE id = $1",
      [id],
    );

    if (productCheck.rows.length === 0) {
      return { success: false, error: "Product not found.", statusCode: 404 };
    }

    if (productCheck.rows[0].seller_id !== user.id) {
      return {
        success: false,
        error: "Forbidden. You do not own this product.",
        statusCode: 403,
      };
    }

    // 3. Update query dynamically or with COALESCE
    const updateResult = await db.query(
      `UPDATE products
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           image_url = COALESCE($4, image_url),
           image_alt = COALESCE($5, image_alt),
           category_id = COALESCE($6, category_id)
       WHERE id = $7
       RETURNING id, title, description, price, image_url, image_alt, seller_id, category_id, created_at`,
      [title, description, price, image_url, image_alt, category_id, id],
    );

    revalidatePath("/shop");
    revalidatePath(`/products/${id}`);

    return {
      success: true,
      data: updateResult.rows[0],
      statusCode: 200,
    };
  } catch (error: unknown) {
    console.error("Service Error while updating product:", error);
    return {
      success: false,
      error: "Internal Server Error while updating product.",
      statusCode: 500,
    };
  }
}

/**
 * Deletes a product using Zod validation for the UUID.
 */
export async function deleteProduct(
  productId: unknown,
): Promise<ServiceResponse> {
  try {
    /*  const user = await getAuthenticatedUser();

    if (!user) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
        statusCode: 401,
      };
    }*/

    // 1. Zod Validation for UUID
    const validation = productIdSchema.safeParse({ id: productId });
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid product ID format.",
        statusCode: 400,
      };
    }

    const { id } = validation.data;
    const db = getDb();

    // 2. Check product existence and ownership
    const productCheck = await db.query(
      "SELECT seller_id FROM products WHERE id = $1",
      [id],
    );

    if (productCheck.rows.length === 0) {
      return { success: false, error: "Product not found.", statusCode: 404 };
    }

    if (productCheck.rows[0].seller_id !== user.id) {
      return {
        success: false,
        error: "Forbidden. You do not own this product.",
        statusCode: 403,
      };
    }

    await db.query("DELETE FROM products WHERE id = $1", [id]);

    revalidatePath("/shop");
    revalidatePath("/products");

    return {
      success: true,
      data: { message: "Product deleted successfully." },
      statusCode: 200,
    };
  } catch (error: unknown) {
    console.error("Service Error while deleting product:", error);
    return {
      success: false,
      error: "Internal Server Error while deleting product.",
      statusCode: 500,
    };
  }
}
