import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"; // Removed as it is not used

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Check if the email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {

            return NextResponse.json(
                { error: "User already Exist" },
                { status: 404 }
            );
         
        }


        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create user and return the ID
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password :hashedPassword, // Hash password in production
            },
        });



        return NextResponse.json({ success: true, userId: user.id });
    } catch (error) {

        return NextResponse.json({ success: false, error: error }, { status: 500 });
    }
}
