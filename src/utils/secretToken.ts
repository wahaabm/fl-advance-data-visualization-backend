import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const privatekey: string = process.env.PRIVATE_KEY!;
export default function createSecretToken(
  id: number,
  email: string,
  role: string,
  isAuthorized: boolean,
  name: string
) {
  return jwt.sign({ id, email, role, isAuthorized, name }, privatekey, {
    expiresIn: "1h",
  });
}
