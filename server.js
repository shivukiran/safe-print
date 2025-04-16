// import express from "express";
// import next from "next";
// import cron from "node-cron";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();
//   server.use(express.json());

//   cron.schedule("*/60 * * * * *", async () => {
//     console.log("Running cleanup job...");
//     try {
//       const now = new Date();
//       const adjustedNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
//       const result = await prisma.file.deleteMany({
//         where: {
//           expiresAt: { lte: adjustedNow },
//         },
//       });
//       console.log(`✅ Deleted ${result.count} expired files.`);
//     } catch (error) {
//       console.error("❌ Error deleting expired files:", error);
//     }
//   });

//   console.log("Cron job started: Checking for expired files every 60 seconds.");

//   server.all("*", (req, res) => handle(req, res));

//   server.listen(3000, () => {
//     console.log("> Ready on http://localhost:3000");
//   });
// });


import express from "express";
import next from "next";
import cron from "node-cron";
import { addHours } from "date-fns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Function to delete expired files
const deleteExpiredFiles = async () => {
  const localDate = new Date();
  const laptopDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000); // Adjust for timezone
  console.log(laptopDate);
  
  try {
    const result = await prisma.file.deleteMany({
      where: {
        expiresAt: { lte: laptopDate }, // Delete files where expiresAt <= now
      },
    });
    console.log(`Deleted ${result.count} expired files.`);
  } catch (error) {
    console.error("Error deleting expired files:", error);
  }
};

// Ensure Next.js is ready before starting the server
app.prepare().then(() => {
  const server = express();

  // 🔧 Middleware for JSON parsing
  server.use(express.json());

  // Run deleteExpiredFiles immediately when the app starts '*/5 * * * * *', 
  deleteExpiredFiles().then(() => {
    console.log("✅ Expired files deletion completed at startup!");
  }).catch((error) => {
    console.error("❌ Error during initial expired files cleanup:", error);
  });

  // 🔁 Cron job every 10 seconds (for testing — change to hourly in production)
  cron.schedule('0 * * * *', () => {
    console.log("Running cleanup job...");
    deleteExpiredFiles();
  });

  console.log("Cron job started: Checking for expired files every 10 seconds.");

  // 🔄 Default request handler for Next.js
  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, () => {
    console.log("> Ready on http://localhost:3000");
  });
}).catch((error) => {
  console.error('Error during Next.js initialization:', error);
});
