import { NextRequest, NextResponse } from "next/server";
import Location from "@/db/models/Location";

export async function PATCH(req: NextRequest) {
  try {
    const reqBody = await req.json();
    console.log(reqBody);
    const { location_id } = reqBody;
    if (!location_id) {
      return NextResponse.json({
        status: 400,
        message: "Location ID is required",
      });
    }
    const updatedLocation = await Location.update(
      { status: 0 },
      { where: { location_id } }
    );
    return NextResponse.json({
      status: 200,
      message: "Location has been marked as archived.",
      data: updatedLocation,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error: " + error.message,
    });
  }
}
