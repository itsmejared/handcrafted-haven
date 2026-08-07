import { NextResponse } from "next/server";
import { getDb } from "@/app/lib/db";
import { auth } from "@/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const db = getDb();

    const orderResult = await db.query(
      `SELECT id, customer_id, total, created_at FROM orders WHERE id = $1`,
      [id]
    );
    const order = orderResult.rows[0];

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }
    if (order.customer_id !== user.id) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const itemsResult = await db.query(
      `SELECT id, product_id, product_title, product_price, seller_name, image_url, quantity
       FROM order_items WHERE order_id = $1`,
      [id]
    );

    return NextResponse.json(
      { ...order, items: itemsResult.rows },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal Server Error while fetching order." },
      { status: 500 }
    );
  }
}
