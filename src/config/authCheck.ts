import jwt from "jsonwebtoken";

export const verifyToken = (req: Request) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) return null;

    const token = authHeader.split(" ")[1];

    if (!token) return null;

    const decoded = jwt.verify(
      token,
      process.env.AUTH_SECRET as string
    );

    return decoded; // contains id, email, role
  } catch (error) {
    return null;
  }
};