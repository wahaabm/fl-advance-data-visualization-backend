import { parse } from 'csv-parse/sync'
import { Request, Response } from 'express'
import prisma from '../utils/prismaClient'

export async function uploadChartCSV(req: Request, res: Response) {
  const { id: userId, role } = req.authorizedData!
  const { title, description } = req.body

  if (role !== 'ADMIN_USER' && role !== 'EDITOR_USER') {
    res.sendStatus(401)
  }

  const csvData = req.file?.buffer.toString('utf8')
  const records = parse(csvData!, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<{
    Date: string
    [key: string]: string
  }>

  if (!records || records.length === 0) {
    res.sendStatus(200)
  }

  const keys = Object.keys(records[0])
  const normalizedRecords = records.map((record) => {
    const newRecord: { [key: string]: string | number } = {}

    keys.forEach((key) => {
      const value = record[key]
      // const parsedValue =
      //   key.toLocaleLowerCase() === 'date' ? Date.parse(value) : value

      newRecord[key.toLocaleLowerCase()] = value
    })

    return newRecord
  })

  try {
    await prisma.plot.create({
      data: {
        title: title,
        description: description,
        data: normalizedRecords,
        authorId: parseInt(userId),
      },
    })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
    console.log(error)
  }
}

export async function deleteChart(req: Request, res: Response) {
  const { chartId } = req.params
  const { role, id: userId } = req.authorizedData!

  if (role !== 'ADMIN_USER' && role !== 'EDITOR_USER') {
    res.sendStatus(401)
    return
  }

  try {
    const existingChart = await prisma.plot.findUnique({
      where: {
        id: parseInt(chartId),
      },
    })

    if (!existingChart) {
      res.sendStatus(404)
      return
    }

    if (role === 'EDITOR_USER' && existingChart.authorId !== userId) {
      res.sendStatus(401)
      return
    }

    await prisma.plot.delete({
      where: {
        id: parseInt(chartId),
      },
    })

    res.sendStatus(200) // Success
  } catch (error) {
    console.error(error)
    res.sendStatus(500) // Internal Server Error
  }
}

export async function addChartData(req: Request, res: Response) {
  try {
    const { chartId } = req.params
    const { role, id: userId } = req.authorizedData!
    if (role !== 'ADMIN_USER' && role !== 'EDITOR_USER') {
      return res.sendStatus(401) // Forbidden
    }

    const formData = req.body
    const existingChart = await prisma.plot.findUnique({
      where: {
        id: parseInt(chartId),
      },
    })

    if (!existingChart) {
      return res.status(404).json({ error: 'Chart not found' })
    }

    if (role === 'EDITOR_USER' && existingChart.authorId !== userId) {
      return res.sendStatus(401)
    }

    const data = existingChart.data as Array<{
      [key: string]: string | number
    }>
    let isReplaced = false

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].date === formData.date) {
        isReplaced = true
        data[i] = formData
        break
      }
    }

    if (!isReplaced) {
      data.push(formData)
    }

    const updatedChart = await prisma.plot.update({
      where: {
        id: existingChart.id,
      },
      data: {
        // @ts-ignore
        data,
      },
    })

    return res.status(200).json(updatedChart)
  } catch (error) {
    console.error('Error adding chart data:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
