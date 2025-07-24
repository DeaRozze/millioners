import { verifyToken } from "../utils/jwt";
export const authMiddleware = async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
        return c.json({ error: "Authorization header missing" }, 401);
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return c.json({ error: "Token missing" }, 401);
    }
    try {
        const decoded = verifyToken(token);
        c.set("user", decoded);
        await next();
    }
    catch (error) {
        return c.json({ error: "Invalid or expired token" }, 401);
    }
};
