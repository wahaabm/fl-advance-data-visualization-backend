import bcrypt from 'bcryptjs'
import prisma from '../src/utils/prismaClient'

const hashedPassword = bcrypt.hashSync('admin@123', 12)

;(async function seed() {
  await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      email: 'admin@admin.com',
      name: 'Administrator',
      hashedPassword: hashedPassword,
      role: 'ADMIN_USER',
      isAuthorized: true,
    },
  })

  const settings = await prisma.settings.findFirst()

  if (!settings) {
    await prisma.settings.create({
      data: {
        actual: 'Actual: Q4',
        previous: 'Previous: Q1',
        facebook: 'https://facebook.com/macrobourse',
        twitter: 'https://twitter.com/macrobourse',
        linkedIn: 'https://linkedIn.com/macrobourse',
        youtube: 'https://youtube.com/macrobourse',
      },
    })
  }
})()
