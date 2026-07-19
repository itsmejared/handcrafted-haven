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
             u.name AS seller_name, c.name AS category_name
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
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

// POST: Add a new product (artisan only)
export async function POST(request: Request) {
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
    const imageUrl = body.imageUrl || body.image_url;
    const imageAlt = body.imageAlt || body.image_alt || title || "Product Image";
    const categoryId = body.categoryId || body.category_id;

    // Validation
    if (!title || !description || price === undefined || !imageUrl || !categoryId) {
      return NextResponse.json(
        { error: "Title, description, price, imageUrl, and categoryId are required." },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number." },
        { status: 400 }
      );
    }

    const db = getDb();

    // Verify category exists
    const categoryCheck = await db.query("SELECT id FROM categories WHERE id = $1", [parseInt(categoryId, 10)]);
    if (categoryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 }
      );
    }

    // Insert new product
    const result = await db.query(
      `INSERT INTO products (title, description, price, image_url, image_alt, seller_id, category_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, title, description, price, image_url AS "imageUrl", image_alt AS "imageAlt", seller_id AS "sellerId", category_id AS "categoryId", created_at`,
      [
        title.trim(),
        description.trim(),
        parsedPrice,
        imageUrl.trim(),
        imageAlt.trim(),
        user.id,
        parseInt(categoryId, 10)
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("API Error while adding product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while adding product." },
      { status: 500 }
    );
  }
}
