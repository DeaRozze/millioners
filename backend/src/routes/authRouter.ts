import { Hono } from "hono";
import { generateToken } from "../utils/jwt";
import { hashPassword, comparePasswords } from "../utils/hash";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = new Hono();

const users = new Map<string, { username: string; password: string; avatar?: string }>();

router.post("/register", async (c) => {
  try {
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
    return c.json({ token, username });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

router.post("/login", async (c) => {
  try {
    const { username, password } = await c.req.json();

    if (!username || !password) {
      return c.json({ error: "Username and password are required" }, 400);
    }

    const user = users.get(username);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: "Invalid password" }, 401);
    }

    const token = generateToken({ username });
    return c.json({ token, username, avatar: user.avatar });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

router.get("/me", authMiddleware, async (c) => {
  const user = c.get("user");
  const userData = users.get(user.username);
  return c.json({
    username: user.username,
    avatar: userData?.avatar || "",
  });
});

export default router;