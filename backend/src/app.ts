import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import questionsRouter from "./routes/questions";
import authRouter from "./routes/authRouter"; // Добавьте этот импорт

const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:5173",
      "https://millioners-d10p10h5v-dearozzes-projects.vercel.app",
      "https://millioners-r46p5v08h-dearozzes-projects.vercel.app",
      "https://millioners.vercel.app",
      "https://millioners-3v16jzpbw-dearozzes-projects.vercel.app", // ✅ ОБЯЗАТЕЛЬНО
    ],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return c.json({ message: "ok" }, { status: 201 }); // Быстро отвечаем без тела
  }
  return next();
});

app.route("/api/questions", questionsRouter);
app.route("/api/auth", authRouter); // Добавьте этот маршрут

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
