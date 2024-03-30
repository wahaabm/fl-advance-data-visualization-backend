import prisma from "../src/utils/prismaClient";
import bcrypt from "bcrypt";

const hashedPassword = bcrypt.hashSync("admin@123", 12);

(async function createAdmin() {
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      email: "admin@admin.com",
      name: "Administrator",
      hashedPassword: hashedPassword,
      role: "ADMIN_USER",
      isAuthorized: true,
    },
  });
})();
