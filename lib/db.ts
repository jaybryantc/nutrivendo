import "server-only";
import { createClient, type Client, type InValue } from "@libsql/client";

function createDbClient(): Client {
  const url = process.env.TURSO_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is missing. Set it in .env.local (e.g. file:./data/nutrivendo.db) or in your hosting environment."
    );
  }
  return createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
}

type GlobalWithDb = typeof globalThis & { __nv_libsql?: Client };
const g = globalThis as GlobalWithDb;
export const db: Client = g.__nv_libsql ?? (g.__nv_libsql = createDbClient());

// ---------- Row types ----------

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  created_at: string;
};

export type OrderPaidWith = "plan" | "card";

export type OrderRow = {
  id: string;
  user_id: string;
  location_id: string;
  pickup_code: string;
  subtotal_cents: number;
  status: "placed" | "ready" | "completed";
  created_at: string;
  paid_with: OrderPaidWith;
  card_last4: string | null;
  subscription_id: string | null;
};

export type OrderItemRow = {
  id: number;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

export type SubscriptionRow = {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "cancelled";
  started_at: string;
  cancelled_at: string | null;
};

// ---------- Time helpers ----------

export function getMonthStartIso(now: Date = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}-01T00:00:00.000Z`;
}

// ---------- Query helpers ----------

export async function getUserByEmail(email: string): Promise<UserRow | undefined> {
  const { rows } = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email.toLowerCase()],
  });
  return rows[0] as unknown as UserRow | undefined;
}

export async function getUserById(id: string): Promise<UserRow | undefined> {
  const { rows } = await db.execute({
    sql: "SELECT * FROM users WHERE id = ?",
    args: [id],
  });
  return rows[0] as unknown as UserRow | undefined;
}

export async function createUser(input: {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
}): Promise<void> {
  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, first_name, last_name, created_at)
          VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      input.id,
      input.email.toLowerCase(),
      input.password_hash,
      input.first_name,
      input.last_name,
      new Date().toISOString(),
    ],
  });
}

export async function getOrdersForUser(userId: string): Promise<OrderRow[]> {
  const { rows } = await db.execute({
    sql: "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
    args: [userId],
  });
  return rows as unknown as OrderRow[];
}

export async function getOrderById(orderId: string): Promise<OrderRow | undefined> {
  const { rows } = await db.execute({
    sql: "SELECT * FROM orders WHERE id = ?",
    args: [orderId],
  });
  return rows[0] as unknown as OrderRow | undefined;
}

export async function getOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const { rows } = await db.execute({
    sql: "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC",
    args: [orderId],
  });
  return rows as unknown as OrderItemRow[];
}

export async function getPlanUsageThisMonth(userId: string): Promise<number> {
  const start = getMonthStartIso();
  const { rows } = await db.execute({
    sql: `SELECT COALESCE(SUM(oi.quantity), 0) AS total
          FROM order_items oi
          JOIN orders o ON o.id = oi.order_id
          WHERE o.user_id = ?
            AND o.paid_with = 'plan'
            AND o.created_at >= ?`,
    args: [userId, start],
  });
  const total = rows[0]?.total;
  return typeof total === "number" ? total : Number(total ?? 0);
}

export type InsertOrderInput = {
  id: string;
  user_id: string;
  location_id: string;
  pickup_code: string;
  subtotal_cents: number;
  status: OrderRow["status"];
  created_at: string;
  paid_with: OrderPaidWith;
  card_last4: string | null;
  subscription_id: string | null;
};

export async function insertOrderTxn(
  order: InsertOrderInput,
  items: Array<Omit<OrderItemRow, "id" | "order_id">>
): Promise<void> {
  await db.batch(
    [
      {
        sql: `INSERT INTO orders (
                id, user_id, location_id, pickup_code, subtotal_cents, status, created_at,
                paid_with, card_last4, subscription_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          order.id,
          order.user_id,
          order.location_id,
          order.pickup_code,
          order.subtotal_cents,
          order.status,
          order.created_at,
          order.paid_with,
          order.card_last4,
          order.subscription_id,
        ] satisfies InValue[],
      },
      ...items.map((i) => ({
        sql: `INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          order.id,
          i.product_id,
          i.product_name,
          i.unit_price_cents,
          i.quantity,
        ] satisfies InValue[],
      })),
    ],
    "write"
  );
}

export async function getActiveSubscription(
  userId: string
): Promise<SubscriptionRow | undefined> {
  const { rows } = await db.execute({
    sql: "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1",
    args: [userId],
  });
  return rows[0] as unknown as SubscriptionRow | undefined;
}

export async function upsertSubscriptionTxn(
  userId: string,
  planId: string
): Promise<void> {
  const now = new Date().toISOString();
  await db.batch(
    [
      {
        sql: `UPDATE subscriptions SET status = 'cancelled', cancelled_at = ?
              WHERE user_id = ? AND status = 'active'`,
        args: [now, userId],
      },
      {
        sql: `INSERT INTO subscriptions (id, user_id, plan_id, status, started_at, cancelled_at)
              VALUES (?, ?, ?, 'active', ?, NULL)`,
        args: [crypto.randomUUID(), userId, planId, now],
      },
    ],
    "write"
  );
}

export async function cancelActiveSubscription(userId: string): Promise<void> {
  await db.execute({
    sql: `UPDATE subscriptions SET status = 'cancelled', cancelled_at = ?
          WHERE user_id = ? AND status = 'active'`,
    args: [new Date().toISOString(), userId],
  });
}
