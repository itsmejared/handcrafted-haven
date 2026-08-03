import { NextRequest, NextResponse } from "next/server";
import { productQuerySchema } from "@/app/lib/validations/product";
import { getProducts } from "@/app/services/products";
import { getAuthenticatedUser } from "@/app/lib/auth";
import { getDb } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Convert searchParams entries to a plain object
    const rawParams = Object.fromEntries(searchParams.entries());

    // Validate and transform parameters with Zod
    const validatedParams = productQuerySchema.safeParse(rawParams);

    if (!validatedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validatedParams.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Execute paginated SQL query with validated data
    const result = await getProducts(validatedParams.data);

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error("API Error while fetching products:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading products." },
      { status: 500 },
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
        { status: 401 },
      );
    }

    if (user.role !== "seller") {
      return NextResponse.json(
        { error: "Forbidden. Only sellers can list products." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const title = body.title;
    const description = body.description;
    const price = body.price;
    const imageUrl = body.imageUrl || body.image_url;
    const imageAlt =
      body.imageAlt || body.image_alt || title || "Product Image";
    const categoryId = body.categoryId || body.category_id;

    // Validation
    if (
      !title ||
      !description ||
      price === undefined ||
      !imageUrl ||
      !categoryId
    ) {
      return NextResponse.json(
        {
          error:
            "Title, description, price, imageUrl, and categoryId are required.",
        },
        { status: 400 },
      );
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number." },
        { status: 400 },
      );
    }

    const db = getDb();

    // Verify category exists
    const categoryCheck = await db.query(
      "SELECT id FROM categories WHERE id = $1",
      [parseInt(categoryId, 10)],
    );
    if (categoryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 },
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
        parseInt(categoryId, 10),
      ],
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error("API Error while adding product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while adding product." },
      { status: 500 },
    );
  }
}
