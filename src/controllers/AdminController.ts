import { Request, Response } from 'express'
import prisma from '../utils/prismaClient'
const privatekey: string = process.env.PRIVATE_KEY!

export async function allowUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params // User ID from the request params
  const { id } = req.authorizedData ?? {}
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found!' })
      return
    }

    if (user.role === 'ADMIN_USER' || user.role === 'EDITOR_USER') {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { isAuthorized: true },
      })
      res
        .status(201)
        .json({ message: 'User has been unauthorized to use the app.' })
    } else {
      res.status(403).json({ message: 'Unauthorized role' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function showUsers(req: Request, res: Response) {
  try {
    const { role, id: userId } = req.authorizedData!
    if (role === 'ADMIN_USER' || role === 'EDITOR_USER') {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })
      if (user?.isAuthorized !== true) {
        res.sendStatus(403)
        return
      }
      const allUsers = await prisma.user.findMany({
        where: {
          NOT: [{ role: 'ADMIN_USER' }, { role: 'EDITOR_USER' }],
        },
        orderBy: {
          id: 'asc',
        },
      })
      res.status(201).send(allUsers)
    } else {
      res.status(403).json({ message: 'Forbidden.' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}

export async function showEditors(req: Request, res: Response) {
  try {
    const { role } = req.authorizedData!
    if (role === 'ADMIN_USER') {
      const editorUsers = await prisma.user.findMany({
        where: {
          role: 'EDITOR_USER',
        },
        orderBy: {
          id: 'asc',
        },
      })
      res.status(201).send(editorUsers)
    } else {
      res.status(403).json({ message: 'Forbidden.' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error!' })
  }
}

export async function makeEditor(req: Request, res: Response): Promise<void> {
  const { id } = req.authorizedData!
  const { userId } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    })
    if (!user) {
      res.status(404).json({ message: 'User not found!' })
      return
    }
    if (user.role === 'ADMIN_USER') {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { role: 'EDITOR_USER', isAuthorized: true },
      })
      res.status(201).json({
        message: 'User has been authorized to use the app as an editor',
      })
    } else {
      res.status(403).json({ message: 'Unauthorized role' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function removeEditor(req: Request, res: Response): Promise<void> {
  const { id } = req.authorizedData!
  const { userId } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    })
    if (!user) {
      res.status(404).json({ message: 'User not found!' })
      return
    }
    if (user.role === 'ADMIN_USER') {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { role: 'NORMAL_USER', isAuthorized: true },
      })
      res.status(201).json({
        message: 'User has been unauthorized to use the app as an editor',
      })
    } else {
      res.status(403).json({ message: 'Unauthorized role' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function revokeUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params // User ID from the request params
  const { id } = req.authorizedData ?? {}
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    })

    if (!user) {
      res.status(404).json({ message: 'User not found!' })
      return
    }

    if (user.role === 'ADMIN_USER' || user.role === 'EDITOR_USER') {
      await prisma.user.update({
        where: { id: parseInt(userId) },
        data: { isAuthorized: false },
      })
      res
        .status(201)
        .json({ message: 'User has been unauthorized to use the app.' })
    } else {
      res.status(403).json({ message: 'Unauthorized role' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
