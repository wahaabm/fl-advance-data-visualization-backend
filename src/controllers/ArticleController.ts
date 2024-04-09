import { Request, Response } from 'express'
import prisma from '../utils/prismaClient'
const privatekey: string = process.env.PRIVATE_KEY!

export async function addArticle(req: Request, res: Response) {
  const { title, content, published, pinned } = req.body
  const { id: authorId, role } = req.authorizedData!

  if (role == 'ADMIN_USER' || role == 'EDITOR_USER') {
    // Check if the user is authorized
    const user = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    try {
      // Create the article
      const newArticle = await prisma.article.create({
        data: {
          title,
          content,
          published,
          pinned,
          authorId,
        },
      })

      return res.status(201).json(newArticle)
    } catch (error) {
      console.error('Error adding article:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(403)
  }
}

export async function editArticle(req: Request, res: Response) {
  const { title, content, pinned, published } = req.body
  const articleId = parseInt(req.params.articleId)
  const { role, id: authorId } = req.authorizedData!

  try {
    if (
      role === 'ADMIN_USER' ||
      (role === 'EDITOR_USER' && (await isArticleAuthor(articleId, authorId)))
    ) {
      const editArticle = await prisma.article.update({
        where: { id: articleId },
        data: { title, content, pinned, published },
      })
      editArticle ? res.sendStatus(200) : res.sendStatus(404)
    } else {
      res.sendStatus(403)
    }
  } catch (error) {
    console.error('Error editing article:', error)
    res.sendStatus(500)
  }
}

async function isArticleAuthor(
  articleId: number,
  userId: number
): Promise<boolean> {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { authorId: true },
  })
  return article?.authorId === userId
}

export async function deleteArticle(req: Request, res: Response) {
  const articleId = parseInt(req.params.articleId)
  const { role, id: userId } = req.authorizedData!

  if (role === 'ADMIN_USER') {
    try {
      const article = await prisma.article.delete({
        where: { id: articleId },
      })
      article ? res.sendStatus(200) : res.sendStatus(404)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  } else if (role === 'EDITOR_USER') {
    try {
      const article = await prisma.article.delete({
        where: { id: articleId, authorId: userId },
      })
      article ? res.sendStatus(200) : res.sendStatus(403)
    } catch (error) {
      console.log(error)
      res.sendStatus(500)
    }
  } else {
    res.sendStatus(403)
  }
}
