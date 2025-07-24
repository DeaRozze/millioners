import * as jwt from "jsonwebtoken";
import { config } from "dotenv";
config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
export const generateToken = (payload) => {
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET is not defined");
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: "HS256" // explicitly specify the algorithm
    });
};
export const verifyToken = (token) => {
    if (!JWT_SECRET)
        throw new Error("JWT_SECRET is not defined");
    return jwt.verify(token, JWT_SECRET, {
        algorithms: ["HS256"]
    });
};
