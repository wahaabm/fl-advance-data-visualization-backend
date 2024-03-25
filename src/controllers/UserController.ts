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
    res.sendStatus(405);
  } else {
    const articles = await prisma.article.findMany({});
    res.status(201).json(articles);
  }
}

export async function showCharts(req: Request, res: Response) {
  const { role, email } = req.authorizedData!;
  console.log(email);
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  if (!user) {
    res.sendStatus(404);
  } else if (user.isAuthorized == false) {
    res.sendStatus(405);
  } else {
    const charts = await prisma.plot.findMany({});
    console.log(charts);
    res.status(201).json(charts);
  }
}
