import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("ownerId");
    
    if (!userId || Array.isArray(userId)) {
        return NextResponse.json({ error: "A single User ID is required" }, { status: 400 });
    }

    console.log("Fetching user with ID:", userId);

    try {
            const user = await prisma.user.findUnique({
                where: { id: userId as string },
            });
            // console.log("Full user object:", user);
            

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ name: user.name }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
