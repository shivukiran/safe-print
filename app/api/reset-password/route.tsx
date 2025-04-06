import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, newPassword } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }



        // Validate input
        if (!email || !newPassword) {
            return NextResponse.json({ error: "Email and new password are required" }, { status: 400 });
        }


        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password in database
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
