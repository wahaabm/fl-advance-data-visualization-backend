import { Request, Response } from "express";
import prisma from "../utils/prismaClient";
import { parse } from "csv-parse/sync";

export async function uploadChartCSV(req: Request, res: Response) {
  const { id: userId, role } = req.authorizedData!;
  const { title, description } = req.body;
  if (role !== "ADMIN_USER" && role !== "EDITOR_USER") {
    res.sendStatus(403);
  }
  const csvData = req.file?.buffer.toString("utf8");
  const records = parse(csvData!, {
    columns: true,
    skip_empty_lines: true,
  });
  console.log(records);

  try {
    await prisma.plot.create({
      data: {
        title: title,
        description: description,
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
  const { role, userId } = req.authorizedData!;

  if (role !== "ADMIN_USER" && role !== "EDITOR_USER") {
    res.sendStatus(403);
    return;
  }

  try {
    const existingChart = await prisma.plot.findUnique({
      where: {
        id: parseInt(chartId),
      },
    });

    if (!existingChart) {
      res.sendStatus(404);
      return;
    }

    if (role === "EDITOR_USER" && existingChart.authorId !== userId) {
      res.sendStatus(403);
      return;
    }

    await prisma.plot.delete({
      where: {
        id: parseInt(chartId),
      },
    });

    res.sendStatus(200); // Success
  } catch (error) {
    console.error(error);
    res.sendStatus(500); // Internal Server Error
  }
}

export async function addChartData(req: Request, res: Response) {
  try {
    const { chartId } = req.params;
    const { role, userId } = req.authorizedData!;

    if (role !== "ADMIN_USER" && role !== "EDITOR_USER") {
      return res.sendStatus(403); // Forbidden
    }

    const { formDataToSubmit } = req.body;
    console.log(formDataToSubmit);
    const existingChart = await prisma.plot.findUnique({
      where: {
        id: parseInt(chartId),
      },
    });

    if (!existingChart) {
      return res.status(404).json({ error: "Chart not found" });
    }

    if (role === "EDITOR_USER" && existingChart.authorId !== userId) {
      return res.sendStatus(403); // Forbidden
    }

    const updatedData = existingChart.data!.concat(formDataToSubmit);

    const updatedChart = await prisma.plot.update({
      where: {
        id: existingChart.id,
      },
      data: {
        data: updatedData,
      },
    });

    return res.status(200).json(updatedChart);
  } catch (error) {
    console.error("Error adding chart data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
