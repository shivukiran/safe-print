import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ownerId = searchParams.get("ownerId");

    console.log("Fetching files for ownerId:", ownerId); // Debugging log

    if (!ownerId) {
        return NextResponse.json({ success: false, error: "Missing ownerId" }, { status: 400 });
    }

    try {
        const files = await prisma.file.findMany({
            where: { ownerId },
            select: { id: true, filename: true },
        });

        console.log("Fetched files:", files); // Debugging log
        return NextResponse.json(files);
    } catch (error) {
        console.error("Fetch files error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch files" }, { status: 500 });
    }
}
