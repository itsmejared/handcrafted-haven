"use server";

import { revalidatePath } from "next/cache";
import { getDb } from "@/app/lib/db";
import { OrderDetails, OrderSummary, PaginatedOrders } from "@/app/lib/types";
import {
  createOrderSchema,
  CreateOrderInput,
} from "@/app/lib/validations/order";

export async function createOrder(userId: string, input: CreateOrderInput) {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Invalid order input");
  }

  const { items } = parsed.data;
  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const db = getDb();

  try {
    await db.query("BEGIN");

    const orderRes = await db.query(
      `INSERT INTO orders (customer_id, total, status)
       VALUES ($1, $2, 'completed')
       RETURNING id, created_at`,
      [userId, total.toFixed(2)],
    );
    const orderId = orderRes.rows[0].id;
    console.log("aqui");
    console.log(orderId);
    console.log(items);
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items (order_id, product_id, product_title, product_image, seller_name, price, quantity)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          orderId,
          item.id || null,
          item.name,
          item.image || null,
          item.seller || null,
          item.price.toFixed(2),
          item.quantity,
        ],
      );
    }

    await db.query("COMMIT");

    revalidatePath("/orders");
    revalidatePath("/cart");

    return { id: orderId, total, success: true };
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error executing createOrder transaction:", error);
    throw new Error("Failed to process order.");
  }
}

export async function getUserOrders(
  userId: string,
  page: number = 1,
  pageSize: number = 5,
): Promise<PaginatedOrders> {
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT id, customer_id, total, status, created_at 
       FROM orders 
       WHERE customer_id = $1 
       ORDER BY created_at DESC`,
      [userId],
    );

    const allOrders: OrderSummary[] = result.rows.map((row) => ({
      ...row,
      total: Number(row.total),
    }));

    const total = allOrders.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const startIndex = (page - 1) * pageSize;
    const paginatedOrders = allOrders.slice(startIndex, startIndex + pageSize);

    return {
      orders: paginatedOrders,
      total,
      page,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { orders: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function getOrderById(
  orderId: string,
  userId: string,
): Promise<OrderDetails | null> {
  try {
    const db = getDb();

    const orderRes = await db.query(
      `SELECT id, customer_id, total, status, created_at
       FROM orders
       WHERE id = $1 AND customer_id = $2`,
      [orderId, userId],
    );

    if (orderRes.rows.length === 0) return null;
    const order = orderRes.rows[0];

    const itemsRes = await db.query(
      `SELECT id, order_id, product_id, product_title, product_image, seller_name, price, quantity
       FROM order_items
       WHERE order_id = $1`,
      [orderId],
    );

    return {
      id: order.id,
      customer_id: order.customer_id,
      total: Number(order.total),
      status: order.status,
      created_at: order.created_at,
      items: itemsRes.rows.map((row) => ({
        ...row,
        price: Number(row.price),
      })),
    };
  } catch (error) {
    console.error(`Error fetching order ${orderId}:`, error);
    return null;
  }
}
