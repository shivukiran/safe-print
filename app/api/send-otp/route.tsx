import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Temporary OTP store (Use Redis/DB in production)
const otpStore = new Map<string, string>();

export async function POST(req: Request) {
    console.log("In sending OTP");

    const { email } = await req.json();

    // Check if email is provided
    if (!email) {
        return NextResponse.json(
            { error: "Email is required" },
            { status: 400 }
        );
    }

    try {
        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, otp);

        // Ensure otpStore is globally accessible
        if (!global.otpStore) global.otpStore = new Map();
        global.otpStore.set(email, otp);

        // Nodemailer config
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"No-Reply" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}. It expires in 5 minutes.`,
        });

        console.log(`Generated OTP for ${email}: ${otp}`);

        // Successful response with user ID
        return NextResponse.json(
            { success: true, message: "OTP sent successfully", userId: user.id },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Error sending OTP:", error);
    
        let message = "Failed to send OTP";
    
        if (error instanceof Error) {
            message = error.message;
        }
    
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
