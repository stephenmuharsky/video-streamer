import jwt from "jsonwebtoken";

export async function verifyToken(token) {
  if (token) {
    const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);

    const userId = decodedToken?.issuer;
    return userId;
  }
  return null;
}
