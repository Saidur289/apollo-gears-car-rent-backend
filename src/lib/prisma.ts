import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import config from "../config";

const connectionString = `${config.database_url}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log: ["error", "warn"],
});

export { prisma };

export async function connectDB() {
  try {
    await prisma.$connect();
    console.log("✓ Database connected successfully");
  } catch (err) {
    console.error("✗ Failed to connect to database:", err);
    throw err;
  }
}

export async function disconnectDB() {
  try {
    await prisma.$disconnect();
    console.log("✓ Database disconnected successfully");
  } catch (err) {
    console.error("✗ Failed to disconnect from database:", err);
    throw err;
  }
}
