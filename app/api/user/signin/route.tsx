



import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
// const SECRET_KEY = process.env.JWT_SECRET || "your_strong_secret_key"; // Use env variables in production

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Find user in the database

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log("No user founddd!");
            return NextResponse.json(
                { error: "No user found!" },
                { status: 404 }
            );
        }

        // Ensure the password field exists (avoid null errors)
        if (!user.password) {
            return NextResponse.json({ success: false, error: "Invalid credentials!" }, { status: 401 });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ success: false, error: "Invalid credentials!" }, { status: 401 });
        }

  

        return NextResponse.json({ success: true, userId: user.id });
    } catch (error) {
        console.error("Signin error:", error);
        return NextResponse.json({ success: false, error: "Sign-in failed!" }, { status: 500 });
    }
}
