import { Request, Response } from "express";
import jwt, { VerifyCallback } from "jsonwebtoken";
import prisma from "../utils/prismaClient";
const privatekey: string = process.env.PRIVATE_KEY!;

export async function app(req: Request, res: Response): Promise<void> {
  if (!req.token) {
    console.log("Token is missing");
    res.sendStatus(403);
    return;
  }

  jwt.verify(req.token, privatekey, (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }

    const { role } = authorizedData;

    if (role === "Admin") {
      // Serve admin dashboard
      res.json({ message: "Welcome to the admin dashboard" });
    } else if (role === "NORMAL_USER") {
      // Serve user page
      res.json({ message: "Hello, user!" });
    } else {
      // Handle unrecognized role
      res.status(403).json({ message: "Unauthorized role" });
    }
  });
}

export async function allowUser(req: Request, res: Response): Promise<void> {
  jwt.verify(req.token!, privatekey, async (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }

    const { role } = authorizedData;
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
  });
}

export async function showUsers(req: Request, res: Response) {
  try {
    jwt.verify(
      req.token!,
      privatekey,
      async (err: any, authorizedData: any) => {
        if (err) {
          console.log("Error: could not connect to the protected route");
          res.sendStatus(403);
        }
        const { role } = authorizedData;
        if (role === "ADMIN_USER" || role === "EDITOR_USER") {
          const allUsers = await prisma.user.findMany({
            select: { id: true, email: true, role: true, isAuthorized: true },
          });
          res.status(201).send(allUsers);
        } else {
          res.status(403).json({ message: "Forbidden." });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error!" });
  }
}

export async function makeEditor(req: Request, res: Response): Promise<void> {
  jwt.verify(req.token!, privatekey, async (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }

    const { role } = authorizedData;
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
  });
}

export async function removeEditor(req: Request, res: Response): Promise<void> {
  jwt.verify(req.token!, privatekey, async (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }

    const { role } = authorizedData;
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
  });
}

export async function revokeUser(req: Request, res: Response): Promise<void> {
  jwt.verify(req.token!, privatekey, async (err: any, authorizedData: any) => {
    if (err) {
      console.log("ERROR: Could not connect to the protected route");
      res.sendStatus(403);
      return;
    }

    const { role } = authorizedData;
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
  });
}
