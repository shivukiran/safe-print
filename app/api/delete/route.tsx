import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import path from "path";

export async function DELETE(req: Request) {
    try {
        const { fileId } = await req.json();
        if (!fileId) return NextResponse.json({ error: "Missing fileId" }, { status: 400 });

        console.log(`🗑️ Deleting file with ID: ${fileId}`);

        // Example: Delete file from database (if using Prisma)
        await prisma.file.delete({ where: { id: fileId } });

        // Example: Delete file from local storage (if storing locally)
        const filePath = path.join(process.cwd(), "uploads", fileId);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`File ${fileId} deleted from storage`);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
