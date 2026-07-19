import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { getAuthenticatedUser } from "@/app/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET: Fetch product details by ID
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const db = getDb();

    const queryText = `
      SELECT p.id, p.title, p.description, p.price, 
             p.image_url AS "imageUrl", p.image_alt AS "imageAlt", 
             p.seller_id AS "sellerId", p.category_id AS "categoryId", p.created_at,
             u.name AS "sellerName", u.bio AS "sellerBio", u.profile_image_url AS "sellerImage", 
             c.name AS "categoryName"
      FROM products p
      JOIN users u ON p.seller_id = u.id
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
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

// PUT: Edit product details (owner seller only)
export async function PUT(request: Request, { params }: RouteParams) {
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

    // Verify product exists and check ownership
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

    const body = await request.json();
    const title = body.title;
    const description = body.description;
    const price = body.price;
    const imageUrl = body.imageUrl || body.image_url;
    const imageAlt = body.imageAlt || body.image_alt || title || "Product Image";
    const categoryId = body.categoryId || body.category_id;

    // Validate inputs if provided
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

    // Verify category exists
    const categoryCheck = await db.query(
      "SELECT id FROM categories WHERE id = $1",
      [parseInt(categoryId, 10)]
    );
    if (categoryCheck.rows.length === 0) {
      return NextResponse.json(
        { error: "Invalid categoryId. Category does not exist." },
        { status: 400 }
      );
    }

    // Update product
    const updateResult = await db.query(
      `UPDATE products 
       SET title = $1, description = $2, price = $3, image_url = $4, image_alt = $5, category_id = $6
       WHERE id = $7
       RETURNING id, title, description, price, image_url AS "imageUrl", image_alt AS "imageAlt", seller_id AS "sellerId", category_id AS "categoryId", created_at`,
      [
        title.trim(),
        description.trim(),
        parsedPrice,
        imageUrl.trim(),
        imageAlt.trim(),
        parseInt(categoryId, 10),
        id
      ]
    );

    return NextResponse.json(updateResult.rows[0], { status: 200 });
  } catch (error: any) {
    console.error("API Error while updating product:", error);
    return NextResponse.json(
      { error: "Internal Server Error while updating product." },
      { status: 500 }
    );
  }
}

// DELETE: Remove product (owner seller only)
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

    // Verify product exists and check ownership
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

    // Delete product
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
