"use server";

import { getDb } from "@/app/lib/db";
import { Product, ProductDetails, ServiceResponse } from "@/app/lib/types";
import { ProductQueryParams } from "@/app/lib/validations/product";
import { revalidatePath } from "next/cache";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
} from "@/app/lib/validations/product";

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
        p.image_alt,
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

/**
 * Creates a new product using Zod validation.
 */
export async function createProduct(
  sellerId: string,
  rawData: unknown,
): Promise<ServiceResponse<Product>> {
  try {
    // Validate payload with Zod
    const validation = createProductSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        statusCode: 400,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const { title, description, price, image_url, image_alt, category_id } =
      validation.data;

    const db = getDb();

    // Verify category exists
    const catCheck = await db.query("SELECT id FROM categories WHERE id = $1", [
      category_id,
    ]);
    if (catCheck.rows.length === 0) {
      return {
        success: false,
        statusCode: 400,
        error: "Selected category does not exist.",
      };
    }

    const query = `
      INSERT INTO products (title, description, price, image_url, image_alt, seller_id, category_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    // Fallback limpio para image_alt en caso de no venir en el payload
    const finalAlt =
      image_alt && image_alt.trim().length > 0
        ? image_alt.trim()
        : title.trim();

    const values = [
      title.trim(),
      description.trim(),
      price,
      image_url,
      finalAlt,
      sellerId,
      category_id,
    ];

    const result = await db.query(query, values);

    // Revalidar los cachés de Next.js para actualizar la vista de la tienda y el listado de productos
    revalidatePath("/product");
    revalidatePath("/shop");

    return {
      success: true,
      statusCode: 201,
      data: result.rows[0] as Product,
    };
  } catch (error: any) {
    console.error("Error in createProduct:", error);
    return {
      success: false,
      statusCode: 500,
      error: "Internal Server Error while creating product.",
    };
  }
}

/**
 * Updates an existing product using Zod validation.
 */
export async function updateProduct(
  productId: string,
  sellerId: string,
  rawData: unknown,
): Promise<ServiceResponse<Product>> {
  try {
    // Validate payload with Zod
    const validation = updateProductSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        statusCode: 400,
        error: validation.error.issues[0]?.message || "Invalid input data",
      };
    }

    const db = getDb();

    // Check ownership
    const ownerCheck = await db.query(
      "SELECT seller_id FROM products WHERE id = $1",
      [productId],
    );

    if (ownerCheck.rows.length === 0) {
      return {
        success: false,
        statusCode: 404,
        error: "Product not found.",
      };
    }

    if (ownerCheck.rows[0].seller_id !== sellerId) {
      return {
        success: false,
        statusCode: 403,
        error: "Forbidden. You do not own this product.",
      };
    }

    const { title, description, price, image_url, image_alt, category_id } =
      validation.data;

    // Verify category if provided
    if (category_id) {
      const catCheck = await db.query(
        "SELECT id FROM categories WHERE id = $1",
        [category_id],
      );
      if (catCheck.rows.length === 0) {
        return {
          success: false,
          statusCode: 400,
          error: "Selected category does not exist.",
        };
      }
    }

    const query = `
      UPDATE products
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          image_url = COALESCE($4, image_url),
          image_alt = COALESCE($5, image_alt),
          category_id = COALESCE($6, category_id)
      WHERE id = $7
      RETURNING *;
    `;

    const values = [
      title && title.trim() ? title.trim() : null,
      description && description.trim() ? description.trim() : null,
      price ?? null,
      image_url ?? null,
      image_alt && image_alt.trim() ? image_alt.trim() : null,
      category_id ?? null,
      productId,
    ];

    const result = await db.query(query, values);

    // Revalidar cachés
    revalidatePath("/product");
    revalidatePath(`/product/${productId}`);
    revalidatePath("/shop");

    return {
      success: true,
      statusCode: 200,
      data: result.rows[0] as Product,
    };
  } catch (error: any) {
    console.error("Error in updateProduct:", error);
    return {
      success: false,
      statusCode: 500,
      error: "Internal Server Error while updating product.",
    };
  }
}

/**
 * Deletes a product using Zod validation for the UUID.
 */
export async function deleteProduct(
  productId: string,
  sellerId: string,
): Promise<ServiceResponse<boolean>> {
  try {
    // 1. Validar formato de ID con Zod
    const validation = productIdSchema.safeParse({ id: productId });
    if (!validation.success) {
      return {
        success: false,
        statusCode: 400,
        error: validation.error.issues[0]?.message || "Invalid product ID",
      };
    }

    const db = getDb();

    // 2. Opcional: Eliminar reseñas asociadas primero si no tienes ON DELETE CASCADE en la BD
    await db.query("DELETE FROM reviews WHERE product_id = $1", [productId]);

    // 3. Eliminar el producto asegurando que pertenece al vendedor autenticado
    const query = `
      DELETE FROM products
      WHERE id = $1 AND seller_id = $2
      RETURNING id;
    `;

    const result = await db.query(query, [productId, sellerId]);

    if (result.rowCount === 0) {
      return {
        success: false,
        statusCode: 404,
        error: "Product not found or you do not have permission to delete it.",
      };
    }

    // 4. Revalidar los cachés de Next.js para actualizar las vistas inmediatamente
    revalidatePath("/product");
    revalidatePath("/shop");

    return {
      success: true,
      statusCode: 200,
      data: true,
    };
  } catch (error: any) {
    console.error("Error in deleteProduct:", error);
    return {
      success: false,
      statusCode: 500,
      error: "Internal Server Error while deleting product.",
    };
  }
}
