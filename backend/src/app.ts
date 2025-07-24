import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import questionsRouter from "./routes/questions";
import authRouter from "./routes/authRouter";

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: (origin) => {
      const allowed = [
        "http://localhost:5173",
        "https://millioners.vercel.app",
      ];

      if (!origin) return null;

      if (allowed.includes(origin)) return origin;

      if (origin.endsWith(".vercel.app")) return origin;

      return null; 
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return c.json({ message: "ok" }, { status: 201 });
  }
  return next();
});

app.route("/api/questions", questionsRouter);
app.route("/api/auth", authRouter);

const port = parseInt(process.env.PORT || "3000");

serve(
  {
    fetch: app.fetch,
    port,
  },
  () => {
    console.log(`Server is running on port ${port}`);
  }
);

export default app;
