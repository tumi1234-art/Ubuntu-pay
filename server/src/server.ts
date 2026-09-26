import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import authRoutes from "./routes/auth.js";
import groupRoutes from "./routes/groups.js";
import contributionRoutes from "./routes/contributions.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
});

await app.register(jwt, {
  secret: process.env.JWT_SECRET!,
});

app.get("/health", async () => ({ status: "ok" }));

await app.register(authRoutes);
await app.register(groupRoutes);
await app.register(contributionRoutes);

const port = Number(process.env.PORT) || 4000;
app.listen({ port, host: "0.0.0.0" }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Ubuntu Pay backend running on port ${port}`);
});
