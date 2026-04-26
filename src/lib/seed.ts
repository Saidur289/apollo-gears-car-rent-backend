import "dotenv/config";
import bcrypt from "bcrypt";
import { prisma } from "./prisma";
import config from "../config";

const ADMIN_EMAIL = config.ADMIN_EMAIL as string;
const ADMIN_PASSWORD = config.ADMIN_PASSWORD as string;
const BCRYPT_SALT_ROUND = parseInt(process.env.BCRYPT_SALT_ROUND || "12", 10);

export async function seedAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: ADMIN_EMAIL },
    });

    if (existingAdmin) {
      console.log("✓ Admin user already exists in database");
      console.log("  Email:", existingAdmin.email);
      console.log("  Role:", existingAdmin.role);
      console.log("  ID:", existingAdmin.id);
      return existingAdmin;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, BCRYPT_SALT_ROUND);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("✓ Admin user created successfully");
    console.log("  Email:", adminUser.email);
    console.log("  Name:", adminUser.name);
    console.log("  Role:", adminUser.role);
    console.log("  ID:", adminUser.id);
    return adminUser;
  } catch (error) {
    console.error("✗ Error seeding admin user:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedAdminUser()
    .then(() => {
      console.log("\n✓ Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n✗ Seed failed:", error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
