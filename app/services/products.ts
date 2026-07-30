"use server";

import { getDb } from "@/app/lib/db";
import { ProductWithDetails } from "@/app/lib/types";
import { ProductQueryParams } from "@/app/lib/validations/product";

/**
 * Server Action to retrieve filtered and paginated products.
 * Can be called directly from Server Components or Client Components.
 */
export async function getProducts(params: ProductQueryParams) {
  const { category_id, product, min_price, max_price, sort, page, limit } =
    params;

  try {
    const db = getDb();

    // 1. Definimos las uniones base de las tablas principales
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

    // Construimos la cláusula WHERE si existen filtros
    let whereClause = "";
    if (whereClauses.length > 0) {
      whereClause = " WHERE " + whereClauses.join(" AND ");
    }

    // 2. Obtener el total de registros para la paginación (No necesita el LEFT JOIN de reviews)
    const countQuery = `SELECT COUNT(*)::int AS total ${baseJoins} ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const total = countResult.rows[0]?.total || 0;

    // 3. Cláusula de ordenamiento
    let orderClause = " ORDER BY p.created_at DESC";
    if (sort === "price-low") {
      orderClause = " ORDER BY p.price ASC";
    } else if (sort === "price-high") {
      orderClause = " ORDER BY p.price DESC";
    } else if (sort === "oldest") {
      orderClause = " ORDER BY p.created_at ASC";
    }

    // 4. Parámetros de paginación (LIMIT & OFFSET)
    const offset = (page - 1) * limit;
    const dataQueryParams = [...queryParams, limit, offset];
    const limitParamIndex = queryParams.length + 1;
    const offsetParamIndex = queryParams.length + 2;

    // 5. Consulta de datos corregida: Colocamos LEFT JOIN antes del WHERE
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
      data: dataResult.rows as ProductWithDetails[],
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
