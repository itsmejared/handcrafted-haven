import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { getAuthenticatedUser } from "@/app/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Fetch product details by ID, including all images
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = getDb();

    const queryText = `
      SELECT p.id, p.title, p.description, p.price,
             p.image_url AS "imageUrl", p.image_alt AS "imageAlt",
             p.seller_id AS "sellerId", p.category_id AS "categoryId", p.created_at,
             u.name AS "sellerName", u.bio AS "sellerBio", u.profile_image_url AS "sellerImage",
             c.name AS "categoryName",
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pi.id,
                   'imageUrl', pi.image_url,
                   'imageAlt', pi.image_alt,
                   'displayOrder', pi.display_order
                 ) ORDER BY pi.display_order
               ) FILTER (WHERE pi.id IS NOT NULL),
               '[]'
             ) AS images
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id, p.title, p.description, p.price, p.image_url, p.image_alt,
               p.seller_id, p.category_id, p.created_at, u.name, u.bio, u.profile_image_url, c.name
    `;

    const result = await db.query(queryText, [id]);
    const product = result.rows[0];

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error("API Error while fetching product details:", error);
    return NextResponse.json(
      { error: "Internal Server Error while loading product details." },
      { status: 500 }
    );
  }
}

// PUT: Edit product details, including replacing its image set (owner seller only)
export async function PUT(request: Request, { params }: RouteParams) {
  const db = getDb();
  const client = await db.connect();

  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // Verify product exists and check ownership
    const productCheck = await client.query(
      "SELECT seller_id FROM products WHERE id = $1",
      [id]
    );

    if (productCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const product = productCheck.rows[0];
    if (product.seller_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. You do not own this product." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const title = body.title;
    const description = body.description;
    const price = body.price;
    const categoryId = body.categoryId || body.category_id;

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

    const categoryCheck = await client.query(
      "SELECT id FROM categories WHERE id = $1",
      [parsedCategoryId]
    );
    if (categoryCheck.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 }
      );
    }

    const primaryImage = images[0];
    const primaryImageAlt = (primaryImage.imageAlt || title).trim();

    const updateResult = await client.query(
      `UPDATE products
       SET title = $1, description = $2, price = $3, image_url = $4, image_alt = $5, category_id = $6
       WHERE id = $7
       RETURNING id, title, description, price, image_url AS "imageUrl", image_alt AS "imageAlt", seller_id AS "sellerId", category_id AS "categoryId", created_at`,
      [
        title.trim(),
        description.trim(),
        parsedPrice,
        primaryImage.imageUrl.trim(),
        primaryImageAlt,
        parsedCategoryId,
        id,
      ]
    );

    // Replace the full image set: simplest correct approach for a small
    // per-product image count. Delete old rows, insert the new set in order.
    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [id]);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      await client.query(
        `INSERT INTO product_images (product_id, image_url, image_alt, display_order)
         VALUES ($1, $2, $3, $4)`,
        [id, img.imageUrl.trim(), (img.imageAlt || title).trim(), i]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(updateResult.rows[0], { status: 200 });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("API Error while updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while updating product." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// DELETE: Remove product (owner seller only). product_images cascade-deletes
// automatically via the ON DELETE CASCADE foreign key — no change needed here.
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const db = getDb();

    const productCheck = await db.query(
      "SELECT seller_id FROM products WHERE id = $1",
      [id]
    );

    if (productCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const product = productCheck.rows[0];
    if (product.seller_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden. You do not own this product." },
        { status: 403 }
      );
    }

    await db.query("DELETE FROM products WHERE id = $1", [id]);

    return NextResponse.json(
      { message: "Product deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error while deleting product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while deleting product." },
      { status: 500 }
    );
  }
}