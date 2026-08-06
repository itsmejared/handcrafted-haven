import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { auth } from "@/auth";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
}

export async function POST(request: Request) {
  const db = getDb();
  const client = await db.connect();
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to check out." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const items: CheckoutItem[] = body.items;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    await client.query("BEGIN");

    const orderResult = await client.query(
      `INSERT INTO orders (customer_id, total, status) VALUES ($1, $2, $3) RETURNING id, created_at`,
      [user.id, total, "completed"]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_title, product_price, seller_name, image_url, quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [orderId, item.id, item.name, item.price, item.seller, item.image, item.quantity]
      );
    }

    await client.query("COMMIT");

    return NextResponse.json(
      { id: orderId, total, created_at: orderResult.rows[0].created_at },
      { status: 201 }
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("API Error creating order:", error);
    return NextResponse.json(
      { error: "Something went wrong while placing your order." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const db = getDb();
    const result = await db.query(
      `SELECT id, total, created_at FROM orders WHERE customer_id = $1 ORDER BY created_at DESC`,
      [user.id]
    );

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error("API Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal Server Error while fetching orders." },
      { status: 500 }
    );
  }
}
