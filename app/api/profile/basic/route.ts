import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "node:fs/promises";
import User from "@/db/models/User";
import { col, fn, literal } from "sequelize";

export async function PATCH(req: Request) {
  try {
    const formData = await req.formData();
    
    const user_id = formData.get("user_id") as string
    const name = formData.get("name")  as string
    const address = formData.get("address")  as string
    const dob = formData.get("dob") as string
    const file = formData.get("imageFile") ? formData.get("imageFile") as File : null;

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

      console.log('file', file)
      if(file && file instanceof File){
         // Replace ':' to avoid issues in file names
        const filePath = `/uploads/images/${file.name}`;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);
        await fs.writeFile(`./public${filePath}`, buffer);
        revalidatePath("/");
        user.image = filePath;
      }
      user.name = name;
      user.address = address;
      user.dob = dob.replace(/"/g, ' ');
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