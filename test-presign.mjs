import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

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
    const command = new GetObjectCommand({
      Bucket: "ibani-bible-audio",
      Key: "IBYLSTN2DA_B01_MAT_001.mp3",
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    console.log(signedUrl);
}
run();
