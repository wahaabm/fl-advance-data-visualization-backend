-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "googleTagManager" TEXT,
    "facebookPixelId" TEXT,
    "facebookPixelToken" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "linkedIn" TEXT,
    "youtube" TEXT,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);
