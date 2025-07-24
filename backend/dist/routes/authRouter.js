import { Hono } from "hono";
import { generateToken } from "../utils/jwt";
import { hashPassword } from "../utils/hash";
import { authMiddleware } from "../middlewares/authMiddleware";
const router = new Hono();
const users = new Map();
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
    }
    catch (error) {
        console.error("Registration error:", error);
        return c.json({ error: "Internal server error" }, 500);
    }
});
router.get("/me", async (c, next) => {
    await authMiddleware(c, next);
    const user = c.get("user");
    return c.json({
        username: user.username,
        avatar: "",
    });
});
export default router;
