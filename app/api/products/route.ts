import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { getAuthenticatedUser } from "@/app/lib/auth";

// GET: Fetch products with filters
export async function GET(request: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const categoryId = searchParams.get("category_id");
    const categorySlug = searchParams.get("category");
    const sellerId = searchParams.get("seller_id");
    const search = searchParams.get("search");
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const sort = searchParams.get("sort");

    let queryText = `
      SELECT p.id, p.title, p.description, p.price, p.image_url, p.image_alt, p.seller_id, p.category_id, p.created_at,
             u.name AS seller_name, c.name AS category_name,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'product_id', pi.product_id,
                   'image_url', pi.image_url,
                   'image_alt', pi.image_alt,
                   'display_order', pi.display_order
                 ) ORDER BY pi.display_order
               ) FILTER (WHERE pi.id IS NOT NULL),
               '[]'
             ) AS images
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
    `;
    const queryParams: any[] = [];
    const whereClauses: string[] = [];

    // Resolve category_id from slug if ?category=slug-name is provided
    let resolvedCategoryId: number | null = null;
    if (categorySlug) {
      const categoriesResult = await db.query("SELECT id, name FROM categories");
      const slugify = (text: string) =>
        text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const matchedCategory = categoriesResult.rows.find(
        (cat: any) => slugify(cat.name) === categorySlug.toLowerCase().trim()
      );
      resolvedCategoryId = matchedCategory ? matchedCategory.id : -1; // -1 if not found
    }

    const finalCategoryId = resolvedCategoryId ?? (categoryId ? parseInt(categoryId, 10) : null);

    if (finalCategoryId !== null) {
      queryParams.push(finalCategoryId);
      whereClauses.push(`p.category_id = $${queryParams.length}`);
    }

    if (sellerId) {
      queryParams.push(sellerId);
      whereClauses.push(`p.seller_id = $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search.trim()}%`);
      whereClauses.push(`(p.title ILIKE $${queryParams.length} OR p.description ILIKE $${queryParams.length} OR u.name ILIKE $${queryParams.length})`);
    }

    if (minPrice) {
      queryParams.push(parseFloat(minPrice));
      whereClauses.push(`p.price >= $${queryParams.length}`);
    }

    if (maxPrice) {
      queryParams.push(parseFloat(maxPrice));
      whereClauses.push(`p.price <= $${queryParams.length}`);
    }

    if (whereClauses.length > 0) {
      queryText += " WHERE " + whereClauses.join(" AND ");
    }

    // Required because of the json_agg aggregate above — every non-aggregated
    // selected column must appear here.
    queryText += `
      GROUP BY p.id, p.title, p.description, p.price, p.image_url, p.image_alt,
               p.seller_id, p.category_id, p.created_at, u.name, c.name
    `;

    if (sort === "price-low") {
      queryText += " ORDER BY p.price ASC";
    } else if (sort === "price-high") {
      queryText += " ORDER BY p.price DESC";
    } else {
      queryText += " ORDER BY p.created_at DESC"; // Default: newest
    }

    const result = await db.query(queryText, queryParams);
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error("API Error while fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading products." },
      { status: 500 }
    );
  }
}

// POST: Add a new product with one or more images (artisan only)
export async function POST(request: Request) {
  const db = getDb();
  const client = await db.connect();

  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    if (user.role !== "seller") {
      return NextResponse.json(
        { error: "Forbidden. Only sellers can list products." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const title = body.title;
    const description = body.description;
    const price = body.price;
    const categoryId = body.categoryId || body.category_id;

    // Accept either the new multi-image shape (images: [{ imageUrl, imageAlt }])
    // or the old single-image shape (imageUrl / imageAlt) for backward compatibility.
    let images: { imageUrl: string; imageAlt?: string }[] = Array.isArray(body.images)
      ? body.images
      : [];

    if (images.length === 0 && (body.imageUrl || body.image_url)) {
      images = [
        {
          imageUrl: body.imageUrl || body.image_url,
          imageAlt: body.imageAlt || body.image_alt,
        },
      ];
    }

    // Validation
    if (!title || !description || price === undefined || !categoryId || images.length === 0) {
      return NextResponse.json(
        { error: "Title, description, price, categoryId, and at least one image are required." },
        { status: 400 }
      );
    }

    for (const img of images) {
      if (!img.imageUrl || !img.imageUrl.trim()) {
        return NextResponse.json(
          { error: "Every image entry must include a non-empty imageUrl." },
          { status: 400 }
        );
      }
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number." },
        { status: 400 }
      );
    }

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      return NextResponse.json(
        { error: "categoryId must be a valid number." },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Verify category exists
    const categoryCheck = await client.query("SELECT id FROM categories WHERE id = $1", [parsedCategoryId]);
    if (categoryCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 }
      );
    }

    const primaryImage = images[0];
    const primaryImageAlt = (primaryImage.imageAlt || title).trim();

    // Insert the product itself. image_url / image_alt store the primary
    // image for quick access on cards/search without joining product_images.
    const result = await client.query(
      `INSERT INTO products (title, description, price, image_url, image_alt, seller_id, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, price, image_url AS "imageUrl", image_alt AS "imageAlt", seller_id AS "sellerId", category_id AS "categoryId", created_at`,
      [
        title.trim(),
        description.trim(),
        parsedPrice,
        primaryImage.imageUrl.trim(),
        primaryImageAlt,
        user.id,
        parsedCategoryId,
      ]
    );

    const productId = result.rows[0].id;

    // Insert every image (including the primary one) into product_images,
    // preserving the order the seller entered them in.
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await client.query(
        `INSERT INTO product_images (product_id, image_url, image_alt, display_order)
         VALUES ($1, $2, $3, $4)`,
        [productId, img.imageUrl.trim(), (img.imageAlt || title).trim(), i]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("API Error while adding product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while adding product." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}