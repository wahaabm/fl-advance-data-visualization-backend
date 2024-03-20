import { Request, Response } from "express";
import jwt, { VerifyCallback } from "jsonwebtoken";
import prisma from "../utils/prismaClient";
import { parse } from "csv-parse/sync";
const privatekey: string = process.env.PRIVATE_KEY!;

export async function addArticle(req: Request, res: Response) {
  const { title, content, published } = req.body;
  const { id:authorId,role } = req.authorizedData!;
  if (role === "ADMIN_USER" || role === "EDITOR_USER") {
    // Check if the user is authorized
    const user = await prisma.user.findUnique({
      where: {
        id: authorId,
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
        where: {
          id: articleId,
        },
        data: {
          title,
          content,
        },
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
  const { role } = req.authorizedData!;
  if (role === "ADMIN_USER" || role === "EDITOR_USER") {
    try {
      const article = await prisma.article.delete({
        where: {
          id: articleId,
        },
      });
      res.sendStatus(200);
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(403);
  }
}
