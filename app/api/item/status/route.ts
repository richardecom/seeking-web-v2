import { NextRequest, NextResponse } from "next/server";
import Item from "@/db/models/Item";

export async function PATCH(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const { item_id } = reqBody;
        if (!item_id) {
            return NextResponse.json({
                status: 400,
                message: "Item ID is required",
            });
        }
        const updatedLocation = await Item.update(
            { status: 0 },
            { where: { item_id } }
          );
        return NextResponse.json({
            status: 200,
            message: "Item has been marked as archived.",
            data: updatedLocation,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error: " + error.message,
        });
    }
}