import prisma from "./prismaClient";

async function getPlotById(plotId: number) {
  try {
    const plot = await prisma.plot.findUnique({
      where: { id: plotId },
    });
    return plot;
  } catch (error) {
    console.error("Error retrieving plot:", error);
    return null;
  }
}

(async function displayPlotValues() {
  const retrievedPlot = await getPlotById(2);
  console.log("here");
  if (retrievedPlot) {
    console.log("Plot Title:", retrievedPlot.title);
    console.log("Plot Description:", retrievedPlot.description);
    console.log("X Values:", retrievedPlot.xValues); // Parse JSON for display
    console.log("Y Values:", retrievedPlot.yValues);
  } else {
    console.error("Plot not found.");
  }
})();
