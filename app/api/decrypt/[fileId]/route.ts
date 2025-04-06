// import { decrypt } from "../../../utils/encryption";
// import { PrismaClient } from "@prisma/client";
// import { NextRequest, NextResponse } from "next/server";

// const prisma = new PrismaClient();

// // export async function GET(req: NextRequest, { params }: { params: { fileId: string } }) {


// // type Context = {
// //   params: {
// //     fileId: string;
// //   };
// // };

// export async function GET(req: NextRequest) {
//   try {
//     console.log("🔑 From download route");

//     const fileId = req.nextUrl.pathname.split("/").pop(); // or use regex to extract
//     if (!fileId) {
//       return NextResponse.json({ error: "Missing fileId in URL" }, { status: 400 });
//     }
//     console.log("🔍 Searching for file with ID:", fileId);

//     const file = await prisma.file.findUnique({
//       where: { id: fileId },
//     });

//     if (!file) {
//       console.error("❌ File not found in database");
//       return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
//     }

//     if (!file.data) {
//       console.error("❌ File data is missing");
//       return new Response(JSON.stringify({ error: "File data is empty" }), { status: 500 });
//     }

//     const decryptedData = decrypt(Buffer.from(file.data));


    
//     // console.log("fileBuffer:", file.data);
//     // console.log("decryptedData:", decryptedData);

//     // Determine file type
//     let contentType = "application/octet-stream";
//     if (file.filename.endsWith(".pdf")) contentType = "application/pdf";
//     if (file.filename.endsWith(".jpg") || file.filename.endsWith(".jpeg")) contentType = "image/jpeg";
//     if (file.filename.endsWith(".png")) contentType = "image/png";
//     if (file.filename.endsWith(".txt")) contentType = "text/plain";

//     return new NextResponse(decryptedData, {
//       headers: {
//         "Content-Disposition": `inline; filename="${file.filename}"`,
//         "Content-Type": contentType,
//       },
//     });
//   } catch (error) {
//     console.error("❌ Decryption error:", error);
//     return new Response(JSON.stringify({ error: "Decryption failed" }), { status: 500 });
//   }
// }


import { decrypt } from "../../../utils/encryption";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    console.log("🔑 From download route");
    console.log("📦 Route executed at:", new Date().toISOString());

    const fileId = req.nextUrl.pathname.split("/").pop();
    if (!fileId) {
      return NextResponse.json({ error: "Missing fileId in URL" }, { status: 400 });
    }

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (!file.data || !(file.data instanceof Uint8Array)) {
      return NextResponse.json({ error: "File data is empty or invalid" }, { status: 500 });
    }

    let decryptedData: Buffer;

    try {
      decryptedData = decrypt(Buffer.from(file.data));
    } catch (e) {
      console.error("❌ Error during decryption:", e);
      return NextResponse.json({ error: "Failed to decrypt file" }, { status: 500 });
    }

    let contentType = "application/octet-stream";
    const ext = file.filename?.split(".").pop()?.toLowerCase() || "";
    switch (ext) {
      case "pdf":
        contentType = "application/pdf";
        break;
      case "jpg":
      case "jpeg":
        contentType = "image/jpeg";
        break;
      case "png":
        contentType = "image/png";
        break;
      case "txt":
        contentType = "text/plain";
        break;
    }

    return new NextResponse(decryptedData, {
      headers: {
        "Content-Disposition": `inline; filename="${file.filename}"`,
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("❌ Unhandled error:", error);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
