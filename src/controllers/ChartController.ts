import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { parse } from "csv-parse/sync";

export async function uploadChartCSV(req: Request, res: Response) {
  const { userId } = req.params;
  const { role } = req.authorizedData!;
  if (role !== "ADMIN_USER" || role !== "EDITOR_USER") {
    res.sendStatus(403);
  }
  const csvData = req.file?.buffer.toString("utf8");
  // Initialize the parser
  const records = parse(csvData!, {
    columns: true,
    skip_empty_lines: true,
  });
  console.log(records);

  try {
    await prisma.plot.create({
      data: {
        title: "test plot",
        data: records,
        authorId: parseInt(userId),
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
  }
}

export async function deleteChart(req: Request, res: Response) {
  const { chartId } = req.params;
  const { role } = req.authorizedData!;
  if (role !== "ADMIN_USER" && role !== "EDITOR_USER") {
    res.sendStatus(403);
    return;
  }
  // Initialize the parser
  try {
    await prisma.plot.delete({
      where: {
        id: parseInt(chartId),
      },
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
