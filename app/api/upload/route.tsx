

import {  encrypt } from "../../utils/encryption";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const ownerId = formData.get("ownerId")?.toString();

    if (!file || !ownerId) {
      return new Response(JSON.stringify({ error: "Missing file or ownerId" }), { status: 400 });
    }

    if (!(file instanceof File)) {
      return new Response(JSON.stringify({ error: "Invalid file type" }), { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const encryptedBuffer = encrypt(fileBuffer);

    // console.log("Before Encrypted data:", fileBuffer);
    // console.log("Encrypted data:", encryptedBuffer);
    // console.log("Decrypted data:", decrypt(encryptedBuffer));
    const localDate = new Date();
    const laptopDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    // console.log(laptopDate);

    const expiresAt = new Date(laptopDate.getTime() + 60 * 60 * 1000); // Set expiration to 1 minute
    await prisma.file.create({
      data: {
        filename: file.name,
        data: encryptedBuffer,
        ownerId: ownerId,
        createdAt: laptopDate,
        expiresAt: expiresAt// 
      },
    });

    return new Response(JSON.stringify({ success: true, message: "File encrypted & uploaded!" }), { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: "Upload error", details: errorMessage }), { status: 500 });
  }
}
