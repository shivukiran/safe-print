import express from "express";
import next from "next";
import cron from "node-cron";
import { addHours } from "date-fns";
// import prisma from "./lib/prisma.js"; // Ensure prisma.js exports correctly

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Schedule the cron job to run every hour
  cron.schedule("0 * * * *", async () => {
    try {
      const cutoffTime = addHours(new Date(), -2); // Files older than 2 hours
      await prisma.file.deleteMany({
        where: {
          createdAt: { lt: cutoffTime },
        },
      });
      console.log("✅ Old files deleted successfully!");
    } catch (error) {
      console.error("❌ Failed to delete old files:", error);
    }
  });

  // API route for deleting all files manually (optional)
  server.delete("/api/deleteAllFiles", async (req, res) => {
    try {
      const { ownerId } = req.body;
      await prisma.file.deleteMany({
        where: { ownerId },
      });
      res.status(200).json({ message: "✅ All files deleted!" });
    } catch (error) {
      res.status(500).json({ error: "❌ Failed to delete files" });
    }
  });

  // Default handler for all requests
  server.all("*", (req, res) => handle(req, res));

  server.listen(3000, () => console.log("> Ready on http://localhost:3000"));
});
