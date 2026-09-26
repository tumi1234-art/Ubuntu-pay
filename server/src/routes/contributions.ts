import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { db } from "../db/client.js";
import { contributions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { logAction } from "../lib/audit.js";

const contributeSchema = z.object({
  groupId: z.string().uuid(),
  amount: z.number().positive(),
});

export default async function contributionRoutes(app: FastifyInstance) {
  app.addHook("onRequest", async (req) => {
    await req.jwtVerify();
  });

  // Simple amount + confirm (sandbox — no real money movement)
  app.post("/contributions", async (req, reply) => {
    const userId = (req.user as any).id;
    const body = contributeSchema.parse(req.body);

    const [contribution] = await db
      .insert(contributions)
      .values({
        groupId: body.groupId,
        userId,
        amount: String(body.amount),
        status: "confirmed",
        isDemoData: true,
      })
      .returning();

    await logAction(userId, "contribution_made", { contributionId: contribution.id });

    return reply.send(contribution);
  });

  // Proof / history: timestamp, status, balance
  app.get("/groups/:id/history", async (req, reply) => {
    const { id } = req.params as { id: string };

    const history = await db.query.contributions.findMany({
      where: eq(contributions.groupId, id),
      orderBy: (c, { desc }) => [desc(c.createdAt)],
    });

    let runningBalance = 0;
    const withBalance = history
      .slice()
      .reverse()
      .map((c) => {
        runningBalance += Number(c.amount);
        return {
          id: c.id,
          amount: Number(c.amount),
          status: c.status,
          timestamp: c.createdAt,
          balance: runningBalance,
          isDemoData: c.isDemoData,
        };
      })
      .reverse();

    return reply.send(withBalance);
  });
}
