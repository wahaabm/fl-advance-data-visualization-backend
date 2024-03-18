import { Request, Response } from "express";
import bcrypt from "bcrypt";
import createSecretToken from "../utils/secretToken";
import prisma from "../utils/prismaClient";

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const auth = await bcrypt.compare(password, user.hashedPassword);

    if (!auth) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = createSecretToken(user.email, user.role);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(404).json({ message: "All field are required." });
      return;
    }
    console.log(email, username);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      res.status(409).json({ message: "User with this email already exists." });
      return;
    }
    const hashedPassword = bcrypt.hashSync(password, 12);
    const user = await prisma.user.create({
      data: {
        name: username,
        email: email,
        hashedPassword: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
