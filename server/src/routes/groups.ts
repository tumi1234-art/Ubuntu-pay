import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/client.js";
import { groups, memberships, contributions, users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { logAction } from "../lib/audit.js";

const createGroupSchema = z.object({
  name: z.string().min(1),
  targetAmount: z.number().positive(),
  timeframeDays: z.number().int().positive(),
});

export default async function groupRoutes(app: FastifyInstance) {
  app.addHook("onRequest", async (req) => {
    await req.jwtVerify();
  });

  // Savings setup: target, amount, timeframe
  app.post("/groups", async (req, reply) => {
    const userId = (req.user as any).id;
    const body = createGroupSchema.parse(req.body);

    const [group] = await db
      .insert(groups)
      .values({ ...body, targetAmount: String(body.targetAmount), createdBy: userId })
      .returning();

    await db.insert(memberships).values({ groupId: group.id, userId });
    await logAction(userId, "group_created", { groupId: group.id });

    return reply.send(group);
  });

  // Join an existing group
  app.post("/groups/:id/join", async (req, reply) => {
    const userId = (req.user as any).id;
    const { id } = req.params as { id: string };

    await db.insert(memberships).values({ groupId: id, userId });
    await logAction(userId, "group_joined", { groupId: id });

    return reply.send({ joined: true });
  });

  // Dashboard: saved, target, progress, members
  app.get("/groups/:id/dashboard", async (req, reply) => {
    const { id } = req.params as { id: string };

    const group = await db.query.groups.findFirst({ where: eq(groups.id, id) });
    if (!group) return reply.status(404).send({ error: "Group not found" });

    const groupContributions = await db.query.contributions.findMany({
      where: eq(contributions.groupId, id),
    });
    const groupMembers = await db.query.memberships.findMany({
      where: eq(memberships.groupId, id),
    });

    const saved = groupContributions.reduce((sum, c) => sum + Number(c.amount), 0);
    const target = Number(group.targetAmount);

    return reply.send({
      group: { id: group.id, name: group.name, target, timeframeDays: group.timeframeDays },
      saved,
      progress: target > 0 ? Math.min(saved / target, 1) : 0,
      memberCount: groupMembers.length,
    });
  });
}
