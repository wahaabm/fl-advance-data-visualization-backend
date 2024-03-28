import jwt from "jsonwebtoken";
import dotenv from "dotenv";
const privatekey: string = process.env.PRIVATE_KEY!;
export default function createSecretToken(
  id: number,
  email: string,
  role: string,
  isAuthorized: boolean
) {
  return jwt.sign({ id, email, role, isAuthorized }, privatekey, {
    expiresIn: "1h",
  });
}
