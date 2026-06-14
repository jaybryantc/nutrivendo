import { createClient } from "@libsql/client";
import fs from "node:fs";
import path from "node:path";

function loadEnvFile(file: string) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!m) continue;
    const [, key, rawVal] = m;
    if (process.env[key]) continue;
    let val = rawVal.trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

// Load .env.local first so local dev settings (e.g. file: DB) win over the
// committed .env.example defaults — loadEnvFile only sets vars not already set.
loadEnvFile(path.join(process.cwd(), ".env.local"));
loadEnvFile(path.join(process.cwd(), ".env.example"));
loadEnvFile(path.join(process.cwd(), ".env"));

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error(
    "TURSO_DATABASE_URL is missing. Set it in .env.local or your shell."
  );
  process.exit(1);
}

if (url.startsWith("file:")) {
  const filePath = url.replace(/^file:/, "");
  const dir = path.dirname(path.resolve(filePath));
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const statements: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
     id              TEXT PRIMARY KEY,
     email           TEXT UNIQUE NOT NULL,
     password_hash   TEXT NOT NULL,
     first_name      TEXT NOT NULL,
     last_name       TEXT NOT NULL,
     created_at      TEXT NOT NULL,
     welcome_discount INTEGER NOT NULL DEFAULT 0
   )`,
  `CREATE TABLE IF NOT EXISTS orders (
     id              TEXT PRIMARY KEY,
     user_id         TEXT NOT NULL REFERENCES users(id),
     location_id     TEXT NOT NULL,
     pickup_code     TEXT NOT NULL,
     subtotal_cents  INTEGER NOT NULL,
     discount_cents  INTEGER NOT NULL DEFAULT 0,
     status          TEXT NOT NULL,
     created_at      TEXT NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS order_items (
     id               INTEGER PRIMARY KEY AUTOINCREMENT,
     order_id         TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
     product_id       TEXT NOT NULL,
     product_name     TEXT NOT NULL,
     unit_price_cents INTEGER NOT NULL,
     quantity         INTEGER NOT NULL
   )`,
  `CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`,
  `CREATE TABLE IF NOT EXISTS subscriptions (
     id           TEXT PRIMARY KEY,
     user_id      TEXT NOT NULL REFERENCES users(id),
     plan_id      TEXT NOT NULL,
     status       TEXT NOT NULL,
     started_at   TEXT NOT NULL,
     cancelled_at TEXT
   )`,
  `CREATE INDEX IF NOT EXISTS idx_subs_user_status ON subscriptions(user_id, status)`,
];

const usersColumns: Array<{ name: string; ddl: string }> = [
  {
    name: "welcome_discount",
    ddl: "welcome_discount INTEGER NOT NULL DEFAULT 0",
  },
];

const ordersColumns: Array<{ name: string; ddl: string }> = [
  { name: "paid_with", ddl: "paid_with TEXT NOT NULL DEFAULT 'card'" },
  { name: "card_last4", ddl: "card_last4 TEXT" },
  { name: "subscription_id", ddl: "subscription_id TEXT" },
  { name: "discount_cents", ddl: "discount_cents INTEGER NOT NULL DEFAULT 0" },
];

const orderItemsColumns: Array<{ name: string; ddl: string }> = [
  { name: "addons", ddl: "addons TEXT" },
];

async function addMissingColumns(
  table: string,
  columns: Array<{ name: string; ddl: string }>
) {
  const info = await client.execute(`PRAGMA table_info(${table})`);
  const existing = new Set(info.rows.map((r) => String(r.name)));
  for (const col of columns) {
    if (!existing.has(col.name)) {
      await client.execute(`ALTER TABLE ${table} ADD COLUMN ${col.ddl}`);
    }
  }
}

async function run() {
  for (const sql of statements) {
    await client.execute(sql);
  }

  await addMissingColumns("users", usersColumns);
  await addMissingColumns("orders", ordersColumns);
  await addMissingColumns("order_items", orderItemsColumns);

  console.log(`Migrated against ${url}`);
}

run()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
