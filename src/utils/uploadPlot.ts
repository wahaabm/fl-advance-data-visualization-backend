import prisma from "./prismaClient";

async function submitPlot(
  title: string,
  description: string,
  xValues: number[],
  yValues: number[]
) {
  try {
    const plot = await prisma.plot.create({
      data: {
        title,
        description,
        xValues: { xValues: JSON.stringify(xValues) },
        yValues: { yValues: JSON.stringify(yValues) },
      },
    });
    console.log(`Plot created successfully with ID: ${plot.id}`);
  } catch (error) {
    console.error("Error submitting plot:", error);
  }
}

// Example usage
const plotData = {
  title: "My Awesome Plot",
  description: "This plot shows some interesting data",
  xValues: [1, 2, 3, 4, 5],
  yValues: [10, 20, 30, 25, 15],
};

submitPlot(
  plotData.title,
  plotData.description,
  plotData.xValues,
  plotData.yValues
);
