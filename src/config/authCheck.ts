import jwt, { JwtPayload } from "jsonwebtoken";

export interface UserData {
  id: string;
  email?: string;
  role?: string;
}

export const verifyToken = (req: Request): UserData | null => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET as string
    );

    // Ensure it's an object (not string)
    if (typeof decoded !== "object" || decoded === null) {
      return null;
    }

    return decoded as UserData;
  } catch (error) {
    return null;
  }
};