import prisma from "../utils/prismaClient";
import { Request, Response } from "express";

export async function showArticles(req: Request, res: Response) {
  const { role, email } = req.authorizedData!;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.sendStatus(404);
  } else if (user.isAuthorized == false) {
    res.sendStatus(403);
  } else {
    const articles = await prisma.article.findMany({});
    res.status(201).json(articles);
  }
}

export async function showCharts(req: Request, res: Response) {
  const { role, email } = req.authorizedData!;
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.sendStatus(404);
  } else if (user.isAuthorized == false) {
    res.sendStatus(403);
  } else {
    const charts = await prisma.article.findMany({});
    res.status(201).json(charts);
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
