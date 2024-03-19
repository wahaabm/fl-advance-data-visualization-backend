import { Request, Response } from "express";
import jwt, { VerifyCallback } from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import { parse } from "csv-parse/sync";
const privatekey: string = process.env.PRIVATE_KEY!;

export async function allowUser(req: Request, res: Response): Promise<void> {
  const { role } = req.authorizedData!;
  const { userId } = req.params;
  if (role === "ADMIN_USER" || role == "EDITOR_USER") {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { isAuthorized: true },
      });
      res.status(201).json({ message: "User athorized to use app." });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "user not found!" });
    }
  } else {
    res.status(403).json({ message: "Unauthorized role" });
  }
}

export async function showUsers(req: Request, res: Response) {
  try {
    const { role } = req.authorizedData!;
    if (role === "ADMIN_USER" || role === "EDITOR_USER") {
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, role: true, isAuthorized: true },
      });
      res.status(201).send(allUsers);
    } else {
      res.status(403).json({ message: "Forbidden." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
}

export async function makeEditor(req: Request, res: Response): Promise<void> {
  const { role } = req.authorizedData!;
  const { userId } = req.params;
  if (role === "ADMIN_USER") {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { role: "EDITOR_USER" },
      });
      res.status(201).json({ message: "User has been made editor" });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "user not found!" });
    }
  } else {
    res.status(403).json({ message: "Unauthorized role" });
  }
}

export async function removeEditor(req: Request, res: Response): Promise<void> {
  const { role } = req.authorizedData!;
  const { userId } = req.params;
  if (role === "ADMIN_USER") {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { role: "NORMAL_USER" },
      });
      res.status(201).json({ message: "User has been removed as editor" });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "user not found!" });
    }
  } else {
    res.status(403).json({ message: "Unauthorized role" });
  }
}

export async function revokeUser(req: Request, res: Response): Promise<void> {
  const { role } = req.authorizedData!;
  const { userId } = req.params;
  if (role === "ADMIN_USER" || role == "EDITOR_USER") {
    try {
      const user = await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { isAuthorized: false },
      });
      res
        .status(201)
        .json({ message: "User has been unathorized to use app." });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "user not found!" });
    }
  } else {
    res.status(403).json({ message: "Unauthorized role" });
  }
}
