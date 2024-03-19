import { Request, Response } from "express";
import jwt, { VerifyCallback } from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import multer from "multer";
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

export async function uploadChartCSV(req: Request, res: Response) {}

export async function addArticle(req: Request, res: Response) {
  const { title, content, published } = req.body;
  const authorId = parseInt(req.params.userId);
  const { role } = req.authorizedData!;
  if (role === "ADMIN_USER" || role === "EDITOR_USER") {
    // Check if the user is authorized
    const user = await prisma.user.findUnique({
      where: {
        id: authorId
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    try {
      // Create the article
      const newArticle = await prisma.article.create({
        data: {
          title,
          content,
          published,
          authorId,
        },
      });

      return res.status(201).json(newArticle);
    } catch (error) {
      console.error("Error adding article:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(403);
  }
}
export async function editArticle(req: Request, res: Response) {
  const { title, content } = req.body;
  const articleId = parseInt(req.params.userId);
  const { role } = req.authorizedData!;
  if (role === "ADMIN_USER" || role == "EDITOR_USER") {
    try {
      const editArticle = await prisma.article.update({
       where:{
        id:articleId
       },
       data:{
        title,
        content,
       }
      });

      return res.status(201).json(editArticle);
    } catch (error) {
      console.error("Error adding article:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(403);
  }
}

export async function deleteArticle(req: Request, res: Response) {
  const articleId = parseInt(req.params.articleId);
  const {role} = req.authorizedData!;
  if(role==="ADMIN_USER" || role==="EDITOR_USER")
  {
    try{
      const article = await prisma.article.delete(
        {
          where:{
            id: articleId
          }
        }
      )
      res.sendStatus(200);
    }catch(error)
    {
      console.log(error);
      res.sendStatus(500);
    }
  }
  else{
    res.sendStatus(403);

  }
}
