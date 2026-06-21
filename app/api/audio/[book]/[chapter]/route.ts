import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { getChapter, getAllBooks } from "@/lib/bible-data";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true,
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ book: string; chapter: string }> }
) {
  try {
    const { book, chapter } = await params;
    
    const chapterNum = parseInt(chapter, 10);
    const data = getChapter(book, chapterNum);
    
    if (!data) {
      return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    }

    const books = getAllBooks();
    const bookIndex = books.findIndex(b => b.code === data.book.code);
    const bNum = String(bookIndex + 1).padStart(2, "0");
    const chNum = String(chapterNum).padStart(3, "0");
    
    const fileName = `IBYLSTN2DA_B${bNum}_${data.book.code}_${chNum}.mp3`;

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
    });

    // Generate a pre-signed URL that expires in 1 hour (3600 seconds)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url: signedUrl });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json({ error: "Failed to generate audio URL" }, { status: 500 });
  }
}
