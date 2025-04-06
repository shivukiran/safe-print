import { PrismaClient } from '@prisma/client';
import cron from 'node-cron';

const prisma = new PrismaClient();

// Function to delete expired files
const localDate = new Date();
const laptopDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
console.log(laptopDate);
async function deleteExpiredFiles() {
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
}


cron.schedule('0 0 * * * *', () => {
    console.log("Running cleanup job...");
    deleteExpiredFiles();
});

console.log("Cron job started: Checking for expired files every 5 minutes.");

export default deleteExpiredFiles;
