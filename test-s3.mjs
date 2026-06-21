import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://2e8611c235b77b8423a0963361386ea1.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: "b7f6085414480cb2ff88a4825abe83dd",
    secretAccessKey: "34ee0754afad71216bb981fd3fe43035920f9b7d5ceb387f3affab279cd84a3d",
  },
  forcePathStyle: true,
});

async function run() {
  try {
    const data = await s3.send(new ListObjectsV2Command({ Bucket: "ibani-bible-audio", MaxKeys: 10 }));
    console.log("Bucket objects:", data.Contents?.map(c => c.Key));
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
