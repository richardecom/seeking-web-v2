import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import User from "@/db/models/User";
import { col, fn, literal } from "sequelize";
import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const Bucket = process.env.AWS_BUCKET_NAME;

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();

    const user_id = formData.get("user_id") as string;
    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const dob = formData.get("dob") as string;
    const files = formData.getAll("imageFile") as File[];

    console.log("imageFile: ", files)

    if (!user_id || !name || !address || !dob) {
      return NextResponse.json({
        status: 400,
        message: `Missing required fields: please check name, address and dob.`,
      });
    }

    const user = (await User.findByPk(parseInt(user_id), {
      attributes: {
        exclude: ["password"],
        include: [
          [
            literal(`CASE WHEN status = 1 THEN 'active' ELSE 'inactive' END`),
            "status",
          ],
          [
            literal(`CASE 
                            WHEN users.user_role = 1 THEN 'Super Admin' 
                            WHEN users.user_role = 2 THEN 'Admin' 
                            ELSE 'Mobile User' END`),
            "user_role",
          ],
          [
            literal(`CASE 
                            WHEN users.user_role = 1 THEN 'super_admin' 
                            WHEN users.user_role = 2 THEN 'admin' 
                            ELSE 'mobile_user' END`),
            "role_code",
          ],
          [fn("COALESCE", col("image"), ""), "image"],
          [
            literal(`DATE_FORMAT(users.date_created, '%Y-%m-%d')`),
            "date_created",
          ],
        ],
      },
    })) as any;
    if (user) {
      console.log("file", files);
      // if(files && files instanceof File){
      //    // Replace ':' to avoid issues in file names
      //   const filePath = `/uploads/images/${file.name}`;
      //   const arrayBuffer = await file.arrayBuffer();
      //   const buffer = new Uint8Array(arrayBuffer);
      //   await fs.writeFile(`./public${filePath}`, buffer);
      //   revalidatePath("/");
      //   user.image = filePath;

      //   const response = await Promise.all(
      //     files.map(async (file) => {
      //       // not sure why I have to override the types here
      //       const Body = (await file.arrayBuffer()) as Buffer;
      //       s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
      //     })
      //   );

      // }

      // if (files.length > 0) {
      //   const response = await Promise.all(
      //     files.map(async (file) => {
      //       // not sure why I have to override the types here
      //       const Body = (await file.arrayBuffer()) as Buffer;
      //       s3.send(new PutObjectCommand({ Bucket, Key: file.name, Body }));
      //     })
      //   );

      //   console.log("IMAGE UPLOAD RESPONSE : ", response);
      // }

      const uploadedFiles: string[] = [];

      if (files.length > 0) {
        // Upload each file to S3
        const uploadPromises = files.map(async (file) => {
          // Generate a unique key for each file
          const fileName = `${Date.now()}-${file.name}`;
          const body = await file.arrayBuffer();
          
          // Upload to S3
          const command = new PutObjectCommand({
            Bucket,
            Key: `uploads/images/${fileName}`, // Use a path for organization
            Body: body as Buffer, // Ensure the body is a Buffer
            ContentType: file.type, // Set the file type
            ACL: "public-read", // Optional: set the file to be publicly readable
          });

          // Send the upload command
          await s3.send(command);

          // Return the file URL (S3 URL)
          const fileUrl = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
          uploadedFiles.push(fileUrl); // Add the file URL to the array
        });

        // Wait for all file uploads to complete
        await Promise.all(uploadPromises);

        console.log("Uploaded files URLs:", uploadedFiles);

        // Update user image field with the uploaded file URL
      }

      user.name = name;
      user.address = address;
      user.dob = dob.replace(/"/g, " ");
      user.save();

      return NextResponse.json({
        status: 201,
        message: "Your basic information has been updated.",
        data: user,
      });
    } else {
      return NextResponse.json({ status: 404, message: "User not found." });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: "fail", error: e });
  }
}
