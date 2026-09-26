import { db } from "../db/client.js";
import { auditLog } from "../db/schema.js";

export async function logAction(userId: string | null, action: string, meta?: unknown) {
  await db.insert(auditLog).values({
    userId: userId ?? undefined,
    action,
    meta: meta ? JSON.stringify(meta) : undefined,
  });
}
