import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL_DIRECT ?? process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL(_DIRECT) is not set");
  const isLocal = /localhost|127\.0\.0\.1/.test(url);

  const sql = postgres(url, { max: 1, ssl: isLocal ? false : "require", prepare: false });
  const db = drizzle(sql);

  console.log("→ running drizzle migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("✓ migrations applied");

  console.log("→ applying views + triggers (functions.sql)…");
  const fns = readFileSync(join(process.cwd(), "db", "functions.sql"), "utf8");
  await sql.unsafe(fns);
  console.log("✓ views + triggers applied");

  await sql.end();
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
