import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

console.log(process.env.DATABASE_URL)
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
