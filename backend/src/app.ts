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
      if (!origin) return null;

      const allowedOrigins = [
        "http://localhost:5173",
        "https://millioners.vercel.app",
      ];

      origin = origin.toLowerCase();

      if (allowedOrigins.includes(origin)) return origin;
      if (origin.endsWith(".vercel.app")) return origin;

      return null;
    },
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

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
