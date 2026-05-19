import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "nutrivendo.db");

type GlobalWithDb = typeof globalThis & { __nv_db?: Database.Database };

function ensureColumn(
  database: Database.Database,
  table: string,
  column: string,
  ddl: string
) {
  const info = database
    .prepare(`PRAGMA table_info(${table})`)
    .all() as { name: string }[];
  if (!info.some((c) => c.name === column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${ddl}`);
  }
}

function createDb(): Database.Database {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      email         TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name    TEXT NOT NULL,
      last_name     TEXT NOT NULL,
      created_at    TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id              TEXT PRIMARY KEY,
      user_id         TEXT NOT NULL REFERENCES users(id),
      location_id     TEXT NOT NULL,
      pickup_code     TEXT NOT NULL,
      subtotal_cents  INTEGER NOT NULL,
      status          TEXT NOT NULL,
      created_at      TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at DESC);

    CREATE TABLE IF NOT EXISTS order_items (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id         TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id       TEXT NOT NULL,
      product_name     TEXT NOT NULL,
      unit_price_cents INTEGER NOT NULL,
      quantity         INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

    CREATE TABLE IF NOT EXISTS subscriptions (
      id           TEXT PRIMARY KEY,
      user_id      TEXT NOT NULL REFERENCES users(id),
      plan_id      TEXT NOT NULL,
      status       TEXT NOT NULL,
      started_at   TEXT NOT NULL,
      cancelled_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_subs_user_status ON subscriptions(user_id, status);
  `);

  // Idempotent column adds for the payment/subscription wiring.
  ensureColumn(db, "orders", "paid_with", "paid_with TEXT NOT NULL DEFAULT 'card'");
  ensureColumn(db, "orders", "card_last4", "card_last4 TEXT");
  ensureColumn(db, "orders", "subscription_id", "subscription_id TEXT");

  return db;
}

const g = globalThis as GlobalWithDb;
export const db: Database.Database = g.__nv_db ?? (g.__nv_db = createDb());

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

export function getUserByEmail(email: string): UserRow | undefined {
  return db
    .prepare<[string], UserRow>("SELECT * FROM users WHERE email = ?")
    .get(email.toLowerCase());
}

export function getUserById(id: string): UserRow | undefined {
  return db
    .prepare<[string], UserRow>("SELECT * FROM users WHERE id = ?")
    .get(id);
}

export function createUser(input: {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
}): void {
  db.prepare(
    `INSERT INTO users (id, email, password_hash, first_name, last_name, created_at)
     VALUES (@id, @email, @password_hash, @first_name, @last_name, @created_at)`
  ).run({
    ...input,
    email: input.email.toLowerCase(),
    created_at: new Date().toISOString(),
  });
}

export function getOrdersForUser(userId: string): OrderRow[] {
  return db
    .prepare<[string], OrderRow>(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC"
    )
    .all(userId);
}

export function getOrderById(orderId: string): OrderRow | undefined {
  return db
    .prepare<[string], OrderRow>("SELECT * FROM orders WHERE id = ?")
    .get(orderId);
}

export function getOrderItems(orderId: string): OrderItemRow[] {
  return db
    .prepare<[string], OrderItemRow>(
      "SELECT * FROM order_items WHERE order_id = ? ORDER BY id ASC"
    )
    .all(orderId);
}

export function getPlanUsageThisMonth(userId: string): number {
  const start = getMonthStartIso();
  const row = db
    .prepare<[string, string], { total: number | null }>(
      `SELECT COALESCE(SUM(oi.quantity), 0) AS total
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE o.user_id = ?
         AND o.paid_with = 'plan'
         AND o.created_at >= ?`
    )
    .get(userId, start);
  return row?.total ?? 0;
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

export const insertOrderTxn = db.transaction(
  (
    order: InsertOrderInput,
    items: Array<Omit<OrderItemRow, "id" | "order_id">>
  ) => {
    db.prepare(
      `INSERT INTO orders (
         id, user_id, location_id, pickup_code, subtotal_cents, status, created_at,
         paid_with, card_last4, subscription_id
       ) VALUES (
         @id, @user_id, @location_id, @pickup_code, @subtotal_cents, @status, @created_at,
         @paid_with, @card_last4, @subscription_id
       )`
    ).run(order);

    const itemStmt = db.prepare(
      `INSERT INTO order_items (order_id, product_id, product_name, unit_price_cents, quantity)
       VALUES (?, ?, ?, ?, ?)`
    );
    for (const i of items) {
      itemStmt.run(
        order.id,
        i.product_id,
        i.product_name,
        i.unit_price_cents,
        i.quantity
      );
    }
  }
);

export function getActiveSubscription(userId: string): SubscriptionRow | undefined {
  return db
    .prepare<[string], SubscriptionRow>(
      "SELECT * FROM subscriptions WHERE user_id = ? AND status = 'active' ORDER BY started_at DESC LIMIT 1"
    )
    .get(userId);
}

export const upsertSubscriptionTxn = db.transaction(
  (userId: string, planId: string) => {
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE subscriptions SET status = 'cancelled', cancelled_at = ? WHERE user_id = ? AND status = 'active'`
    ).run(now, userId);
    db.prepare(
      `INSERT INTO subscriptions (id, user_id, plan_id, status, started_at, cancelled_at)
       VALUES (?, ?, ?, 'active', ?, NULL)`
    ).run(crypto.randomUUID(), userId, planId, now);
  }
);

export function cancelActiveSubscription(userId: string): void {
  db.prepare(
    `UPDATE subscriptions SET status = 'cancelled', cancelled_at = ? WHERE user_id = ? AND status = 'active'`
  ).run(new Date().toISOString(), userId);
}
