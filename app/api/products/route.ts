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

// POST: Add a new product with one or more images (artisan only)
export async function POST(request: Request) {
  const db = getDb();
  const client = await db.connect();

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
        { status: 400 },
      );
    }

    for (const img of images) {
      if (!img.imageUrl || !img.imageUrl.trim()) {
        return NextResponse.json(
          { error: "Every image entry must include a non-empty imageUrl." },
          { status: 400 },
        );
      }
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { error: "Price must be a positive number." },
        { status: 400 },
      );
    }

    const parsedCategoryId = parseInt(categoryId, 10);
    if (isNaN(parsedCategoryId)) {
      return NextResponse.json(
        { error: "categoryId must be a valid number." },
        { status: 400 },
      );
    }

    await client.query("BEGIN");

    // Verify category exists
    const categoryCheck = await client.query(
      "SELECT id FROM categories WHERE id = $1",
      [parsedCategoryId],
    );
    if (categoryCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 },
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
      ],
    );

    const productId = result.rows[0].id;

    // Insert every image (including the primary one) into product_images,
    // preserving the order the seller entered them in.
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await client.query(
        `INSERT INTO product_images (product_id, image_url, image_alt, display_order)
         VALUES ($1, $2, $3, $4)`,
        [productId, img.imageUrl.trim(), (img.imageAlt || title).trim(), i],
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("API Error while adding product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while adding product." },
      { status: 500 },
    );
  } finally {
    client.release();
  }
}