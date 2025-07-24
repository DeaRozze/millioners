import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import questionsRouter from "./routes/questions";
import authRouter from "./routes/authRouter";

const app = new Hono();

app.use("*", async (c, next) => {
  try {
    return await next();
  } catch (err) {
    console.error(err);

    return c.json(
      { error: "Internal Server Error" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": c.req.header("Origin") || "",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
      }
    );
  }
});

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
