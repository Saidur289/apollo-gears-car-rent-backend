import app from "./app";
import config from "./config";
import { connectDB, disconnectDB } from "./lib/prisma";

let server: any;

async function main() {
  try {
    // Connect to database
    await connectDB();

    server = app.listen(config.port, () => {
      console.log(`✓ Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    await disconnectDB();
    process.exit(1);
  }
}

// Graceful shutdown handler
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      console.log("✓ Server closed");

      try {
        await disconnectDB();
      } catch (err) {
        console.error("Error during database shutdown:", err);
      }

      process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      console.error("✗ Forced shutdown - graceful shutdown timeout exceeded");
      process.exit(1);
    }, 30000);
  } else {
    process.exit(0);
  }
};

// Handle SIGTERM (termination signal)
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", async (err: Error) => {
  console.error("✗ Uncaught Exception:", err.message);
  console.error(err.stack);
  await disconnectDB();
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", async (reason: any, promise: Promise<any>) => {
  console.error("✗ Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
  await disconnectDB();
  process.exit(1);
});

main();

