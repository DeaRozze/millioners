import { Hono } from "hono";
import { generateToken } from "../utils/jwt";
import { hashPassword, comparePasswords } from "../utils/hash";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = new Hono();

const users = new Map<string, { username: string; password: string }>();

router.post("/register", async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }

  if (users.has(username)) {
    return c.json({ error: "Username already exists" }, 400);
  }

  const hashedPassword = await hashPassword(password);
  users.set(username, { username, password: hashedPassword });

  const token = generateToken({ username });
  return c.json({ token });
});

router.post("/login", async (c) => {
  const { username, password } = await c.req.json();

  const user = users.get(username);
  if (!user) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const isValid = await comparePasswords(password, user.password);
  if (!isValid) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = generateToken({ username });
  return c.json({ token });
});

router.use("/me", authMiddleware).get("/me", (c) => {
  const user = c.get("user");
  return c.json({
    username: user.username,
    avatar: "",
  });
});

export default router;
