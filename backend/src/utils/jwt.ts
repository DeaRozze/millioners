import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

interface JwtPayload {
  username: string;
}

export const generateToken = (payload: JwtPayload): string => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  
  return jwt.sign(
    payload, 
    JWT_SECRET, 
    { 
      expiresIn: JWT_EXPIRES_IN,
      algorithm: "HS256" 
    } as jwt.SignOptions
  );
};

export const verifyToken = (token: string): JwtPayload => {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ["HS256"]
  }) as JwtPayload;
};