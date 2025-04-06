// pages/api/deleteAll.js

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function DELETE(req: Request) {

    const {userId} = await req.json();

    console.log("Owner Id :" ,userId)
         if (!userId) return NextResponse.json({ error: "Missing fileId" }, { status: 400 });


         console.log(`Deleting all files with UserId : ${userId}` )

        try {
            if (!userId) {
                
                            alert("No user Id")
            }
            await prisma.file.deleteMany({
                where: {
                    ownerId: userId,
                },
            });

            return NextResponse.json({ message: "All files deleted successfully" }, { status: 200 });
        } catch (error) {
            console.error("Error deleting files:", error);
            return NextResponse.json({ error: "Failed to delete files" }, { status: 500 });
        }
    }
