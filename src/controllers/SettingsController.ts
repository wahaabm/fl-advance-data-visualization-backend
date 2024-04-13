import { Request, Response } from 'express'
import prisma from '../utils/prismaClient'

export async function getSettings(req: Request, res: Response) {
  try {
    const settings = await prisma.settings.findFirst()

    res.status(200).json(settings)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export async function postSettings(req: Request, res: Response) {
  // const {
  //   googleTagManager,
  //   facebookPixelId,
  //   facebookPixelToken,
  //   twitter,const {
  //   googleTagManager,
  //   facebookPixelId,
  //   facebookPixelToken,
  //   twitter,
  //   facebook,
  //   linkedIn,
  //   youtube,
  //   previous,
  //   actual,
  // } = req.body
  const { role } = req.authorizedData!

  if (role !== 'ADMIN_USER') {
    res.status(401)
  }

  try {
    const settings = await prisma.settings.findFirst()
    const updatedSettings = Object.assign(settings || {}, req.body)

    if (!settings) {
      const newSettings = await prisma.settings.create({
        data: updatedSettings,
      })

      return res.status(201).json(newSettings)
    } else {
      const newSettings = await prisma.settings.upsert({
        where: { id: settings?.id },
        create: updatedSettings,
        update: updatedSettings,
      })

      return res.status(201).json(newSettings)
    }
  } catch (error) {
    console.error('Error adding article:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
