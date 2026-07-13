import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const isLocal = /localhost|127\.0\.0\.1/.test(connectionString);

declare global {
  // eslint-disable-next-line no-var
  var __zellige_pg__: ReturnType<typeof postgres> | undefined;
}

// One pooled client per instance. prepare:false keeps us safe behind any
// pooler; max is kept low so serverless instances never storm Railway's
// connection ceiling. Page reads are single-query (via the view), so one
// connection per request is enough — never Promise.all queries on max:1.
const client =
  global.__zellige_pg__ ??
  postgres(connectionString, {
    prepare: false,
    ssl: isLocal ? false : "require",
    max: process.env.NODE_ENV === "production" ? 1 : 5,
    idle_timeout: 20,
    connect_timeout: 30,
  });

if (process.env.NODE_ENV !== "production") {
  global.__zellige_pg__ = client;
}

export const db = drizzle(client, { schema });
export const sql = client;
export { schema };
