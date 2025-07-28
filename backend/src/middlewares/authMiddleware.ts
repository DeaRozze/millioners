import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";

declare module "hono" {
  interface ContextVariableMap {
    user: { username: string };
  }
}

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Авторизация");

  if (!authHeader) {
    return c.json({ error: "Заголовок авторизации отсутствует" }, 401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return c.json({ error: "Токен отсутствует" }, 401);
  }

  try {
    const decoded = verifyToken(token);
    c.set("user", decoded);
    await next();
  } catch (error) {
    return c.json({ error: "Недействительный или просроченный токен" }, 401);
  }
};
