import Category from "@/db/models/Category";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const requiredFields = ["category_id"];
    const missingFields = requiredFields.filter((field) => !reqBody[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        status: 400,
        message: `Missing required field: ${missingFields.join(", ")}.`,
      });
    }
    const category_id = reqBody.category_id;
    const payload = {
      status: 0,
    };
    await Category.update(payload, { where: { category_id } });
    // const updated = await Category.findByPk(category_id)
    return NextResponse.json({
      status: 201,
      message: "Category has been archived successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
