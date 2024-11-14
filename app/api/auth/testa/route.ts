import User from "@/db/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await User.findByPk(2);
      return NextResponse.json({
        status: 200,
        message: "Successfully get all category data.",
        data:user
      });
    } catch (error) {
      return NextResponse.json({
        status: 500,
        message: "Internal Server Error: " + error.message,
      });
    }
  }