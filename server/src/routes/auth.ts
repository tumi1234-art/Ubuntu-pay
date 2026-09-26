import type { FastifyInstance } from "fastify";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "../db/client.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { logAction } from "../lib/audit.js";

const registerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  password: z.string().min(6),
});

const loginSchema = z.object({
  phone: z.string().min(6),
  password: z.string().min(6),
});

export default async function authRoutes(app: FastifyInstance) {
  // Welcome / Create-Join screen -> register
  app.post("/auth/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);

    const existing = await db.query.users.findFirst({ where: eq(users.phone, body.phone) });
    if (existing) return reply.status(409).send({ error: "Phone already registered" });

    const passwordHash = await bcrypt.hash(body.password, 10);
    const [user] = await db
      .insert(users)
      .values({ name: body.name, phone: body.phone, passwordHash })
      .returning();

    await logAction(user.id, "user_registered", { phone: body.phone });

    const token = app.jwt.sign({ id: user.id, role: user.role });
    return reply.send({ token, user: { id: user.id, name: user.name, role: user.role } });
  });

  app.post("/auth/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);

    const user = await db.query.users.findFirst({ where: eq(users.phone, body.phone) });
    if (!user) return reply.status(401).send({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(body.password, user.passwordHash);
    if (!valid) return reply.status(401).send({ error: "Invalid credentials" });

    await logAction(user.id, "user_logged_in");

    const token = app.jwt.sign({ id: user.id, role: user.role });
    return reply.send({ token, user: { id: user.id, name: user.name, role: user.role } });
  });
}
