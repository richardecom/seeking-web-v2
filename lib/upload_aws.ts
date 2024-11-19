import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Initialize the AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const Bucket = process.env.AWS_BUCKET_NAME;
// Define allowed MIME types (whitelist)
const whitelistImages = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

type UploadFilesResponse = string[] | { error: string; invalidFiles: string[] };

// Service to upload files to S3
export const uploadFilesToS3 = async (
  files: File[]
): Promise<UploadFilesResponse> => {
  const uploadedFileUrls: string[] = [];

  // Validate file types
  const invalidFiles = files.filter(
    (file) => !whitelistImages.includes(file.type)
  );
  if (invalidFiles.length > 0) {
    // throw new Error(`Invalid file types: ${invalidFiles.map(file => file.name).join(", ")}`);
    return {
      error: `Invalid file type.`,
      invalidFiles: invalidFiles.map((file) => file.name),
    };
  }

  // Process each file
  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`; // Generate unique file name
    const fileBuffer = Buffer.from(await file.arrayBuffer()); // Convert the file to a Buffer

    try {
      // Upload file to S3
      const command = new PutObjectCommand({
        Bucket,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.type,
        ACL: "public-read", // Make the file publicly accessible
      });

      await s3.send(command);

      // Construct the file's URL after uploading
      const fileUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
      uploadedFileUrls.push(fileUrl);
    } catch (error) {
      console.error("S3 Upload Error:", error);
      //   throw new Error("File upload failed. Please try again.");
      return {
        error: `File upload failed. Please try again.`,
        invalidFiles: [],
      };
    }
  }

  return uploadedFileUrls; // Return an array of URLs
};
