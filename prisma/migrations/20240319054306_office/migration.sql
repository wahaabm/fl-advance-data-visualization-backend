-- CreateTable
CREATE TABLE "Plot" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "xValues" JSONB,
    "yValues" JSONB,

    CONSTRAINT "Plot_pkey" PRIMARY KEY ("id")
);
