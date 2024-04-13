import { Request, Response } from 'express'
import prisma from '../utils/prismaClient'

export async function showPinnedArticles(req: Request, res: Response) {
  const { role, email } = req.authorizedData!
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  if (!user) {
    res.sendStatus(404)
  } else if (user.isAuthorized == false) {
    res.sendStatus(405)
  } else {
    const articles = await prisma.article.findMany({
      where: {
        pinned: true,
      },
      orderBy: {
        id: 'desc',
      },
    })
    res.status(201).json(articles)
  }
}

export async function showArticles(req: Request, res: Response) {
  const { role, email } = req.authorizedData!
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  if (!user) {
    res.sendStatus(404)
  } else if (user.isAuthorized == false) {
    res.sendStatus(405)
  } else {
    const articles = await prisma.article.findMany({
      orderBy: {
        id: 'desc',
      },
    })
    res.status(201).json(articles)
  }
}

export async function showCharts(req: Request, res: Response) {
  const { role, email } = req.authorizedData!
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  if (!user) {
    res.sendStatus(404)
  } else if (user.isAuthorized == false) {
    res.sendStatus(405)
  } else {
    const charts = await prisma.plot.findMany({
      orderBy: {
        id: 'desc',
      },
    })
    res.status(201).json(charts)
  }
}

export async function readArticle(req: Request, res: Response) {
  const { role, email } = req.authorizedData!
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })
  const articleId = parseInt(req.params.articleId)
  if (!user) {
    res.sendStatus(404)
  } else if (user.isAuthorized == false) {
    res.sendStatus(405)
  } else {
    const articles = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    })
    res.status(201).json(articles)
  }
}

// TODO: load only published articles exept admin
